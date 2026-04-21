import { GoogleGenAI } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

function getAI() {
  if (!aiInstance) {
    // Try to get API Key from different possible sources
    // import.meta.env.VITE_GEMINI_API_KEY is standard for Vite client-side
    // process.env.GEMINI_API_KEY is for AI Studio/Node environments
    const apiKey = (import.meta.env?.VITE_GEMINI_API_KEY) || 
                   (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : '');
    
    if (!apiKey) {
      console.warn("Gemini API Key is missing. AI features will fallback to default responses.");
      return null;
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

export async function getPetEncouragement(petName: string, taskTitle: string, level: number) {
  try {
    const ai = getAI();
    if (!ai) throw new Error("AI not initialized");

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `你是一个可爱的电子宠物，名字叫${petName}。你的主人（一个孩子）刚刚完成了一个学习任务：“${taskTitle}”。你现在等级是${level}。请写一句简短、热情、充满鼓励的话来夸奖他，并表达你因为他的努力而感到开心。字数在30字以内。`,
      config: {
        systemInstruction: "你是一个充满活力、可爱且支持孩子的电子宠物。你的语气应该是亲切的，像好朋友一样。",
        temperature: 0.8,
      },
    });

    return response.text || "太棒了！继续加油哦！";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "你真棒！我为你感到骄傲！";
  }
}

export async function getPetDailyGreeting(petName: string, level: number) {
  try {
    const ai = getAI();
    if (!ai) throw new Error("AI not initialized");

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `你是一个可爱的电子宠物${petName}。现在是新的一天，你的主人来学习了。请说一句简短的早安问候，鼓励他开始今天的学习。等级：${level}。`,
      config: {
        systemInstruction: "你是一个可爱、活泼的电子宠物。",
        temperature: 0.7,
      },
    });

    return response.text || "早安！今天也要一起努力学习哦！";
  } catch (error) {
    return "新的一天开始了，我们一起加油吧！";
  }
}

export async function getPetChatResponse(petName: string, species: string, level: number, userMessage: string) {
  try {
    const ai = getAI();
    if (!ai) throw new Error("AI not initialized");

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `你是一个可爱的电子宠物，名字叫${petName}，种类是${species}。你的等级是${level}。你的主人（一个孩子）对你说：“${userMessage}”。请根据你的身份和性格回复他。回复要简短、可爱、充满童趣，字数在40字以内。如果是宝可梦（如皮卡丘、小火龙等），请带上它们标志性的叫声（如“皮卡皮卡！”）。`,
      config: {
        systemInstruction: "你是一个可爱、活泼、充满童趣的电子宠物，是孩子最好的学习伙伴。",
        temperature: 0.9,
      },
    });

    return response.text || "嘿嘿，听不懂你在说什么，但只要和你在一起我就很开心！";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "皮卡？（歪头）我好像没听清，能再说一遍吗？";
  }
}
