# 🏆 VKT MASTER INTEGRATION BLUEPRINT
*Tài liệu Chuẩn hóa Kỹ thuật & Thiết kế cho Hệ sinh thái Dự án VKT*

Tài liệu này đóng gói toàn bộ các giải pháp công nghệ đã được tối ưu hóa thực chiến nhằm ngăn ngừa các lỗi thường gặp về API Key, giới hạn sinh kịch bản dài của LLM, đứt gãy âm thanh và định dạng xuất Excel. Hãy cung cấp file này cho AI Agent khi phát triển các dự án tiếp theo.

---

## 1. Chuẩn Hóa Giao Diện Cảnh Báo API Key (React + Tailwind CSS)
**Vấn đề**: Người dùng quên cấu hình API Key dẫn đến việc hệ thống chạy ngầm rồi báo lỗi không rõ nguyên nhân.
**Giải pháp**: Tích hợp trạng thái nhấp nháy đỏ cảnh báo trực quan tại nút cấu hình.

```tsx
// Thêm prop nhận diện số lượng key hoạt động (keyCount) vào Header component
interface HeaderProps {
  keyCount: number;
  onOpenConfig: () => void;
}

export const Header: React.FC<HeaderProps> = ({ keyCount, onOpenConfig }) => {
  return (
    <button 
      onClick={onOpenConfig}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
        keyCount > 0 
          ? 'bg-[#161a22] text-slate-400 border border-slate-700/50 hover:bg-[#1e2230] hover:text-slate-200' 
          : 'bg-red-950/20 text-red-400 border border-red-500/40 animate-pulse hover:bg-red-900/30'
      }`}
    >
      {/* Icon xoay tròn nếu chưa có Key */}
      <i className={`fa-solid fa-key ${keyCount === 0 ? 'text-red-400 animate-spin' : ''}`}></i>
      <span>Cấu hình API</span>
      
      {/* Badge số lượng key nảy lên và phát sáng khi trống */}
      <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
        keyCount > 0 
          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
          : 'bg-red-500 text-white border border-red-400 shadow-[0_0_8px_rgba(239,68,68,0.7)] animate-bounce'
      }`}>
        {keyCount}
      </span>
    </button>
  );
};
```

---

## 2. Bộ Bắt Lỗi Gemini API Tiếng Việt Thân Thiện (aiService)
**Vấn đề**: Các lỗi hệ thống trả về mã tiếng Anh khó hiểu (429, 400 Invalid) làm người dùng bối rối.
**Giải pháp**: Bẫy lỗi HTTP Status và dịch sang chỉ dẫn tiếng Việt chi tiết.

```typescript
async function callGoogleWithRetry(prompt: string, systemPrompt: string, retries = 3) {
  // ... cấu hình URL & body fetch
  try {
    const res = await fetch(url, { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(body) 
    });
    
    // 1. Bẫy lỗi Hết lượt miễn phí (429)
    if (res.status === 429) {
      throw new Error("API_LIMIT_EXCEEDED: Hạn mức API Gemini của bạn đã hết lượt miễn phí (429 Quota Exceeded). Vui lòng thêm/thay Key mới hoặc đổi sang OpenAI/OpenRouter!");
    }
    
    if (!res.ok) {
      const errText = await res.text();
      
      // 2. Bẫy lỗi Key sai hoặc bị khóa (400)
      if (res.status === 400 && (errText.includes("API_KEY_INVALID") || errText.includes("invalid"))) {
        throw new Error("API_KEY_INVALID: API Key Gemini này không hợp lệ hoặc đã bị Google khóa! Vui lòng mở Config (chìa khóa) để thay thế Key hoạt động.");
      }
      
      // 3. Bẫy lỗi Chưa kích hoạt Google AI Studio (403)
      if (res.status === 403) {
        throw new Error("API_KEY_FORBIDDEN: API Key Gemini bị từ chối truy cập (403 Forbidden). Hãy chắc chắn rằng bạn đã kích hoạt dịch vụ Google AI Studio cho tài khoản này.");
      }
      
      throw new Error(`Google Error ${res.status}: ${errText}`);
    }
    
    const data = await res.json();
    return data.candidates[0].content.parts[0].text;
  } catch (e: any) {
    // Logic xoay vòng key hoặc tính thời gian chờ lũy tiến (Exponential Backoff)
    const isQuota = e.message?.includes('429') || e.message?.includes('API_LIMIT_EXCEEDED');
    const waitTime = isQuota ? 2000 * (retryIndex + 1) : 500;
    await new Promise(r => setTimeout(r, waitTime));
  }
}
```

---

## 3. Thuật Toán Dệt Kịch Bản Phân Đoạn Nối Tiếp (Script Chunking Algorithm)
**Vấn đề**: Giới hạn Max Response Tokens của LLM khiến kịch bản dài (>3 phút, tương đương >25 cảnh) bị cắt cụt giữa chừng.
**Giải pháp**: Dệt kịch bản theo các vòng lặp (rounds), mỗi vòng xử lý tối đa 25 cảnh và truyền ngữ cảnh nối tiếp kịch bản để đảm bảo tính liên tục.

```typescript
const handleGenerate = async () => {
  const totalScenes = Math.ceil((duration * 60) / SECONDS_PER_SCENE);
  const chunkSize = 25; // Giới hạn an toàn tối đa cho 1 lần gọi LLM
  const totalRounds = Math.ceil(totalScenes / chunkSize);
  
  let allSegments: any[] = [];
  
  for (let round = 1; round <= totalRounds; round++) {
    const startSceneNum = (round - 1) * chunkSize + 1;
    const endSceneNum = Math.min(round * chunkSize, totalScenes);
    const roundSceneCount = endSceneNum - startSceneNum + 1;

    // Thiết lập prompt truyền ngữ cảnh tiếp nối kịch bản
    let continuityContext = '';
    if (allSegments.length > 0) {
      const lastFew = allSegments.slice(-3); // Lấy 3 cảnh gần nhất làm mẫu
      continuityContext = `\n[CONTINUITY CONTEXT]: The story has already progressed through the first ${allSegments.length} scenes. Here are the last 3 scenes for context:
${JSON.stringify(lastFew.map(s => ({ scene_number: s.scene_number, voice_text: s.voice_text, visual_desc_vi: s.visual_desc_vi })), null, 2)}
CRITICAL: You MUST write the next scenes continuing this exact storyline seamlessly starting at Scene ${startSceneNum}. Do NOT repeat these scene contents, move the story forward.`;
    }

    const prompt = `TOPIC: "${topic}"
ROUND_GENERATING: Round ${round} of ${totalRounds} (Generating scenes ${startSceneNum} to ${endSceneNum})
ROUND_SCENE_COUNT: ${roundSceneCount} (Generate exactly ${roundSceneCount} scenes starting at number ${startSceneNum})
${continuityContext}
Return a JSON array containing exactly ${roundSceneCount} elements...`;

    const json = await callAI(prompt, SYSTEM_PROMPT);
    const roundSegs = json.script || json;
    
    // Gán nhãn thời gian timeline tự động
    const processedSegs = roundSegs.map((s: any, idx: number) => {
      const calculatedNum = startSceneNum + idx;
      const min = Math.floor(((calculatedNum - 1) * 8) / 60);
      const secStart = ((calculatedNum - 1) * 8) % 60;
      const secEnd = (calculatedNum * 8) % 60;
      const minEnd = Math.floor((calculatedNum * 8) / 60);
      const formatTime = (m: number, sec: number) => `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
      
      return {
        ...s,
        scene_number: calculatedNum,
        time: `${formatTime(min, secStart)} - ${formatTime(minEnd, secEnd)}`,
      };
    });

    allSegments = [...allSegments, ...processedSegs];
  }
  
  setSegments(allSegments);
};
```

---

## 4. Kỹ Nghệ Viết Prompt (Prompt Engineering) Cho Âm Thanh & Hình Ảnh
Để đồng nhất hóa chất lượng âm thanh và hình ảnh của video đầu ra, hệ thống Prompts bắt buộc phải nhúng các khối chỉ thị cứng sau:

### A. Chỉ thị Liền Mạch Âm Thanh (Audio Continuity Protocol)
```markdown
# [AUDIO CONTINUITY PROTOCOL - GIỮ NGUYÊN]:
- Đảm bảo nhạc nền chính (BGM) và âm thanh môi trường (tiếng mưa, tiếng gió, tiếng nước chảy) của cảnh trước được nối tiếp tự nhiên sang cảnh sau.
- Bắt buộc ghi nhận rõ hiệu ứng vuốt âm lượng (Crossfade/Fade) ở đầu mô tả `sfx_music_suggestion` của cảnh tiếp theo.
- Ví dụ chỉ thị sfx: "The sound of [BGM/ambient] from the previous scene smoothly crossfades into this scene over 2 seconds, keeping a constant volume of -20dB."
- Cảnh 1 của mọi kịch bản bắt buộc phải bắt đầu bằng âm thanh nhận diện thương hiệu: "VKT Signature Intro (Tibetan singing bowl resonance + deep meditative breathing ASMR + soft dry leaves crushing)".
```

### B. Thủy Ấn Bản Quyền Tự Nhiên Trong Cảnh (Organic/Diegetic Brand Signature)
Để lồng ghép logo thương hiệu VKT một cách tinh tế, nghệ thuật mà không bị phô trương hoặc bị cắt mất khi scale video, hệ thống tuyệt đối cấm đè logo lên góc màn hình mà phải dệt trực tiếp vào vật thể trong cảnh:
```markdown
# [BRAND WATERMARK SIGNATURE & DYNAMIC EMBLEM RULE]:
- Tự động lựa chọn 01 biểu tượng logo thích hợp nhất đại diện cho phân ngách/chủ đề hiện tại (ví dụ: "enso circle" cho Thiền Định, "bodhi leaf" cho Trí Tuệ, "glowing sprout" cho Chữa Lành...).
- Ghi nhận tên tiếng Anh của biểu tượng được lựa chọn vào trường "suggested_watermark" ở cấp cao nhất của JSON đầu ra.
- Lồng ghép biểu tượng [WATERMARK_EMBLEM] vào mô tả video_prompt và image_prompt hữu cơ theo 2 trường hợp:
  1. Nếu có nhân vật: "a subtle embroidered [WATERMARK_EMBLEM] pattern on the chest/collar/sleeve of the character's robe/clothing" (ví dụ: thêu chìm trên áo nhân vật).
  2. Nếu không có nhân vật: "a minimalist [WATERMARK_EMBLEM] motif carved on the temple door/wooden wall" (hoặc chạm trên chuông đồng "engraved on the side of the bronze bell", in trên bình trà, bàn đá).
```

---

## 5. Định Dạng Xuất Excel Kịch Bản V2 (CSV Export)
**Vấn đề**: Các biên tập viên hoặc kỹ thuật viên âm thanh gặp khó khăn khi đọc bảng dữ liệu CSV truyền thống do các cột phân tách rời rạc và các cảnh dính liền nhau không có khoảng nghỉ trực quan.
**Giải pháp**: Xuất file kịch bản phiên bản V2 gộp nhãn trực tiếp và chèn dòng trống phân cách giữa các phân cảnh để mở rộng giao diện đọc trên Excel.

```typescript
const exportCSV2 = (segments: any[], topic: string) => {
  if (!segments.length) return;
  let csv = '\uFEFF'; // Thêm BOM để tránh lỗi font tiếng Việt hiển thị trên Excel
  
  segments.forEach((s, i) => {
    const vp = s.voice_profile || {};
    const sfx = s.sfx_music_suggestion || s.sfx_suggestion || '';
    
    // Gộp nhãn trực tiếp vào đầu mỗi trường dữ liệu để tăng tốc độ đọc
    const colA = `Scene ${i + 1}`;
    const colB = `Time: ${s.time} | Section: ${s.section}`;
    const colC = `Character: ${s.character}`;
    const colD = `Voice: ${s.voice_text || ''}`;
    const colE = `Speaker: ${vp.speaker || ''}`;
    const colF = `Gender: ${vp.gender || ''}`;
    const colG = `Age: ${vp.age || ''}`;
    const colH = `Accent: ${vp.accent || ''}`;
    const colI = `Timbre: ${vp.timbre || ''}`;
    const colJ = `Tone: ${vp.tone || ''}`;
    const colK = `Pacing: ${vp.pacing || ''}`;
    const colL = `Speed: ${vp.pacing_speed || ''}`;
    const colM = `Words: ${s.word_count || ''}`;
    const colN = `End Time: ${s.audio_end_time || ''}`;
    const colO = `State: ${vp.state || ''}`;
    const colP = `Audio SFX ASMR Music: ${sfx}`;
    const colQ = `Video Prompt: ${s.video_prompt || ''}`;
    const colR = `Image Prompt: ${s.image_prompt || ''}`;

    // Nối các cột lại với nhau bằng dấu phẩy, xử lý ký tự ngoặc kép
    csv += `"${colA.replace(/"/g, '""')}","${colB.replace(/"/g, '""')}","${colC.replace(/"/g, '""')}","${colD.replace(/"/g, '""')}","${colE.replace(/"/g, '""')}","${colF.replace(/"/g, '""')}","${colG.replace(/"/g, '""')}","${colH.replace(/"/g, '""')}","${colI.replace(/"/g, '""')}","${colJ.replace(/"/g, '""')}","${colK.replace(/"/g, '""')}","${colL.replace(/"/g, '""')}","${colM.replace(/"/g, '""')}","${colN.replace(/"/g, '""')}","${colO.replace(/"/g, '""')}","${colP.replace(/"/g, '""')}","${colQ.replace(/"/g, '""')}","${colR.replace(/"/g, '""')}"\n`;
    
    // BẮT BUỘC chèn 1 dòng trống hoàn toàn giữa các Scene để phân cảnh trực quan trên Excel
    csv += '\n';
  });

  // Tải file tự động
  downloadFile(csv, `${topic}_csv2.csv`, 'text/csv;charset=utf-8;');
};
```

---
*Bản Thiết Kế Tích Hợp Chuẩn VKT — Phiên bản 1.0 (20/05/2026)*
