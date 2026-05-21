export type NicheConfig = {
  nicheName: string;
  targetAudience: string;
  toneAndVibe: string;
  specialRules: string[];
};

export const CURRENT_NICHE: NicheConfig = {
  nicheName: "Dharma Studio - Phật Pháp & Chữa Lành",
  targetAudience: "Những người đang gặp khủng hoảng, căng thẳng, cần tìm sự bình yên, muốn hiểu về luật nhân quả, Phật pháp ứng dụng trong đời sống.",
  toneAndVibe: "Trang nghiêm, sâu lắng, tĩnh tại, từ bi, chữa lành, không phán xét.",
  specialRules: [
    "TUYỆT ĐỐI an toàn, không có yếu tố bạo lực, ma quỷ đáng sợ hay mê tín dị đoan.",
    "Giữ nguyên các thuật ngữ Phật giáo mộc mạc (Nhân quả, Vô thường, Chánh niệm) nhưng giải thích dễ hiểu.",
    "Luôn kết thúc bằng sự bao dung, ánh sáng và lối thoát hướng thiện.",
    "Âm thanh phải có tính thiền (tiếng chuông, mõ, nhạc cụ dân tộc nhẹ nhàng, ASMR mộc mạc)."
  ]
};
