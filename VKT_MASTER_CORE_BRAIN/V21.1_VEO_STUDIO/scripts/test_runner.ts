import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 1. Lấy API key từ env hoặc truyền vào CLI
const apiKey = process.env.VITE_GEMINI_API_KEY || process.argv[2];
if (!apiKey) {
    console.error("❌ THẤT BẠI: Cần cung cấp Gemini API Key (qua env VITE_GEMINI_API_KEY hoặc param CLI)");
    process.exit(1);
}

// 2. Mock để import được từ codebase (vì codebase dùng ES modules / TS)
// Để đơn giản, ta sẽ chỉ copy system prompt hiện tại để test, hoặc chạy qua tsx.
// Ở đây ta giả định dùng `tsx` để chạy file này.
import { buildScriptWriterPrompt } from '../src/data/prompts';
import { CURRENT_NICHE } from '../src/data/nicheConfig';

async function generateScript(duration: number, hookPrompt: string) {
    const systemInstruction = buildScriptWriterPrompt(CURRENT_NICHE);
    const userPrompt = `Tạo kịch bản cho video dài ${duration} phút. Chủ đề: ${hookPrompt}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            system_instruction: { parts: [{ text: systemInstruction }] },
            contents: [{ parts: [{ text: userPrompt }] }],
            generationConfig: {
                response_mime_type: "application/json",
            }
        })
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${await response.text()}`);
    }

    const data = await response.json();
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!resultText) {
        throw new Error("Không có phản hồi từ AI");
    }

    return JSON.parse(resultText);
}

// ==========================================
// BỘ LỌC QUÉT LỖI (ASSERTIONS)
// ==========================================
function assertTest(condition: boolean, message: string) {
    if (condition) {
        console.log(`✅ PASS: ${message}`);
    } else {
        console.error(`❌ FAILED: ${message}`);
        throw new Error("Test Failed: " + message);
    }
}

async function runTests() {
    console.log("🚀 Bắt đầu chạy Test Tự Động Toàn Diện VKT (Thực Nghiệm Thực Tế)\n");

    try {
        console.log("⏳ Đang test: Kịch bản 30 giây (Quy chuẩn 1)...");
        const json30s = await generateScript(0.5, "Sự vô thường của tuổi trẻ");
        
        const scenes = json30s.refined_scenes;
        assertTest(scenes && scenes.length > 0, "AI sinh được danh sách cảnh");
        assertTest(scenes.length >= 3 && scenes.length <= 5, `Số lượng cảnh hợp lý cho 30s (hiện có: ${scenes.length})`);

        // Test Word Count & Speed Pacing cho TỪNG cảnh
        for (let i = 0; i < scenes.length; i++) {
            const scene = scenes[i];
            const wordCount = scene.word_count || (scene.dialogues && scene.dialogues.length > 0 ? scene.dialogues[0].line.split(" ").length : 0);
            
            assertTest(wordCount >= 30 && wordCount <= 40, `Cảnh ${i+1} có số từ đúng chuẩn (30-40 từ). Hiện tại: ${wordCount} từ.`);

            const speed = scene.voice_profile?.pacing_speed || "";
            assertTest(speed !== "" && speed !== "1.18x", `Cảnh ${i+1} có tính toán tốc độ động chứ không bị hardcode 1.18x. Hiện tại: ${speed}`);
            
            if (wordCount >= 38) {
                assertTest(speed.includes("1.2"), `Cảnh ${i+1} (${wordCount} từ) tốc độ phải đẩy lên mức > 1.2x. Hiện tại: ${speed}`);
            }
        }

        // Test Câu Chốt (Signature Outro)
        const lastScene = scenes[scenes.length - 1];
        const lastLine = lastScene.dialogues && lastScene.dialogues.length > 0 ? lastScene.dialogues[0].line : "";
        assertTest(lastLine.includes("Dharma Studio"), `Cảnh cuối phải chứa câu chốt "Dharma Studio". Nội dung: ${lastLine}`);

        // Test Ma Trận
        const firstScene = scenes[0];
        const firstVisual = (firstScene.visual_desc_vi || "").toLowerCase();
        assertTest(firstVisual.includes("chánh điện") || firstVisual.includes("master"), `Cảnh 1 tuân thủ không gian Ma trận (Đại chánh điện/tượng Master).`);

        console.log("\n🎉 TOÀN BỘ TEST CASES PASS THÀNH CÔNG! HỆ THỐNG ĐÃ HOÀN HẢO TẬN GỐC.\n");

    } catch (e) {
        console.error("\n🔥 PHÁT HIỆN LỖI TRONG THỰC NGHIỆM:");
        console.error(e);
        process.exit(1);
    }
}

runTests();
