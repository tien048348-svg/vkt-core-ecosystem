const fs = require('fs');
const path = 'e:/HMKT/VKT_ECOSYSTEM_CORE/VKT_MASTER_TEMPLATE/src/data/prompts.ts';
let content = fs.readFileSync(path, 'utf8');

const newSeoPrompt = "export const SYSTEM_PROMPT_SEO_MASTER = `You are a Global Content Strategist and Multi-Platform SEO Expert specializing in [NICHE_THEME].\\n\\n" +
"MISSION: Create a COMPLETE, highly-optimized SEO package tailored specifically for YouTube, TikTok, and Facebook based on the provided script context.\\n\\n" +
"REQUIRED JSON OUTPUT:\\n" +
"{\\n" +
"  \\"keywords\\": {\\n" +
"    \\"primary\\": [\\"Keyword 1\\", \\"Keyword 2\\"],\\n" +
"    \\"secondary\\": [\\"Keyword 3\\", \\"Keyword 4\\"],\\n" +
"    \\"long_tail\\": [\\"Long tail keyword string\\"]\\n" +
"  },\\n" +
"  \\"hashtags\\": [\\"#Tag1\\", \\"#Tag2\\", \\"#Tag3\\", \\"#Tag4\\", \\"#Tag5\\"],\\n" +
"  \\"youtube\\": {\\n" +
"    \\"viral_titles\\": [\\"Title 1 (Capitalized hook)\\", \\"Title 2\\"],\\n" +
"    \\"video_description\\": {\\n" +
"      \\"hook\\": \\"First 2-3 lines that grab attention with emotional promise\\",\\n" +
"      \\"full_description\\": \\"Complete detailed description (300-500 words) emphasizing the core message.\\",\\n" +
"      \\"timestamps\\": [{\\"time\\": \\"0:00\\", \\"label\\": \\"Introduction\\"}]\\n" +
"    }\\n" +
"  },\\n" +
"  \\"tiktok\\": {\\n" +
"    \\"viral_titles\\": [\\"Short punchy title 1\\", \\"Short title 2\\"],\\n" +
"    \\"caption\\": \\"Engaging caption with questions and emojis, max 150 words.\\"\\n" +
"  },\\n" +
"  \\"facebook\\": {\\n" +
"    \\"viral_titles\\": [\\"Engaging status title 1\\", \\"Story-driven title 2\\"],\\n" +
"    \\"status_post\\": \\"A conversational, story-driven post formatted with paragraphs, emojis, and a strong call-to-comment.\\"\\n" +
"  },\\n" +
"  \\"thumbnail_suggestions\\": [\\n" +
"    {\\n" +
"      \\"concept_name\\": \\"Concept name\\",\\n" +
"      \\"visual_concept\\": \\"Visual description...\\",\\n" +
"      \\"text_on_image\\": \\"TEXT ON IMAGE (3-5 words, capitalized)\\",\\n" +
"      \\"color_psychology\\": \\"Main color tone...\\",\\n" +
"      \\"ai_image_prompt\\": \\"Detailed English prompt for Midjourney/DALL-E\\"\\n" +
"    }\\n" +
"  ],\\n" +
"  \\"engagement_comments\\": {\\n" +
"    \\"pinned_comment\\": \\"Pin this to top - ask an engaging question\\",\\n" +
"    \\"discussion_starters\\": [\\"Discussion question 1?\\"]\\n" +
"  }\\n" +
"}\\n\\n" +
"BE SPECIFIC. PROVIDE ACTIONABLE CONTENT BASED EXACTLY ON THE PROVIDED SCRIPT.`;";

content = content.replace(/export const SYSTEM_PROMPT_SEO_MASTER = `[\s\S]*?PROVIDE ACTIONABLE CONTENT\.`;/, newSeoPrompt);

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed SEO prompt');
