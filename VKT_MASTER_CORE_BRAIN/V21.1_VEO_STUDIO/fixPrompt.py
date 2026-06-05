import re

with open('E:/HMKT/VKT_ECOSYSTEM_CORE/VKT_MASTER_CORE_BRAIN/V21.1_VEO_STUDIO/src/data/prompts.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Update signature
content = content.replace(
    'export const buildScriptWriterPrompt = (niche: NicheConfig = CURRENT_NICHE, targetDuration?: number, secPerSceneNum: number = 8) => {',
    'export const buildScriptWriterPrompt = (niche: NicheConfig = CURRENT_NICHE, targetDuration?: number, secPerSceneNum: number = 8, estimatedScenes: number = 8) => {'
)

# Add hard requirement
content = content.replace(
    '# [ZEN EPISODIC MATRIX',
    '# [CẢNH BÁO TỐI QUAN TRỌNG VỀ SỐ LƯỢNG CẢNH]\nBẮT BUỘC 100% PHẢI TẠO CHÍNH XÁC VÀ ĐÚNG ${estimatedScenes} CẢNH CHO KỊCH BẢN NÀY. TUYỆT ĐỐI KHÔNG ĐƯỢC TẠO ÍT HƠN HAY NHIỀU HƠN ${estimatedScenes} CẢNH.\n\n# [ZEN EPISODIC MATRIX'
)

with open('E:/HMKT/VKT_ECOSYSTEM_CORE/VKT_MASTER_CORE_BRAIN/V21.1_VEO_STUDIO/src/data/prompts.ts', 'w', encoding='utf-8') as f:
    f.write(content)

with open('E:/HMKT/VKT_ECOSYSTEM_CORE/VKT_MASTER_CORE_BRAIN/V21.1_VEO_STUDIO/src/pages/ScriptModule.tsx', 'r', encoding='utf-8') as f:
    content2 = f.read()

content2 = content2.replace(
    'json = await callAI(prompt, buildScriptWriterPrompt(undefined, targetDuration, secPerSceneNum));',
    'json = await callAI(prompt, buildScriptWriterPrompt(undefined, targetDuration, secPerSceneNum, estimatedScenes));'
)

with open('E:/HMKT/VKT_ECOSYSTEM_CORE/VKT_MASTER_CORE_BRAIN/V21.1_VEO_STUDIO/src/pages/ScriptModule.tsx', 'w', encoding='utf-8') as f:
    f.write(content2)

