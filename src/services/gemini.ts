import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getPetEncouragement(petName: string, taskTitle: string, level: number) {
  try {
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
