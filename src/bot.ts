import { info } from "./data";

function getPreMadeAnswer(question: string): string | null {
  const q = question.toLowerCase();
  if (q.includes("name")) return `His name is ${info.name}`;
  if (q.includes("city") || q.includes("from") || q.includes("live") || q.includes("location")) return `He lives in ${info.location}`;
  if (/\bage\b/i.test(q) || /\bold\b/i.test(q)) return `Gabriel is ${info.age}`;
  if (q.includes("born") || q.includes("birth")) return `Gabriel was born in ${info.born}`;
  if (q.includes("grade")) return `Gabriel is a ${info.education.grade}`;
  
  if (q.includes("education") || q.includes("school") || q.includes("study") || q.includes("course")) {
    return `${info.education.degree} in ${info.education.course} at ${info.education.institution}, from ${info.education.start} until ${info.education.expectedGraduation}`;
  }
  if (q.includes("github")) return `His GitHub is: ${info.github}`;
  if (q.includes("linkedin")) return `His LinkedIn is: ${info.linkedin}`;

  if (q.includes("interest") || q.includes("hobby") || q.includes("like")) return `He likes ${info.interests.join(", ")}`;

  if (q.includes("sports") || q.includes("sport") || q.includes("soccer") || q.includes("running")) {
    return `His favorite sport is ${info.sports.main}, But I also like ${info.sports.frequent}. My favorite running spots are in ${info.sports.favoriteRunningLocations.join(" or ")}, ${info.sports.note}. and his favorite soccer team is ${info.sports.favoriteTeam}`;
  }

  if (q.includes("experience") || q.includes("work") || q.includes("job")) {
    return info.workExperience
      .map(exp => `${exp.position} at ${exp.company} (${exp.period}): ${exp.details}`)
      .join(" | ");
  }

  if (q.includes("certification") || q.includes("certified") || q.includes("certificate")) {
    return `He's a ${info.certifications.join(", ")}`;
  }

  if (q.includes("tall") || q.includes("height")) {
    return `Gabriel is ${info.height}`;
  }

  if (q.includes("fat") || q.includes("weight")) {
    return `Gabriel is ${info.weight}`;
  }

  if (q.includes("languages") || q.includes("speak") || q.includes("spoken")) {
    return info.languages
      .map(lang => `${lang.name} (${lang.level})`)
      .join(", ");
  }

  if (q.includes("programming") || q.includes("code")) {
    return `The programming languages he knows are: ${info.programmingLanguages.join(", ")}.`;
  }

  if (q.includes("framework")) {
    return `The frameworks he uses are: ${info.frameworks.join(", ")}.`;
  }

  if (q.includes("cloud") || q.includes("aws")) {
    return `The clouds he knows are: ${info.clouds.join(", ")}.`;
  }

  if (q.includes("fun fact") || q.includes("fact") || q.includes("curiosity")) {
    return info.funFacts.join(" | ");
  }
  return null;
}

async function askAI(question: string): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  if (!apiKey) return "AI API key not set.";
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.origin,
        "X-Title": document.title || "myChatbot"
      },
      body: JSON.stringify({
        model: "google/gemini-pro-1.5",
        messages: [
          { role: "system", content: "You are a helpful assistant. If the question is about Gabriel, answer as if you know him. If not, answer normally, and only give short answers" },
          { role: "user", content: question }
        ],
        max_tokens: 200,
        stream: false
      }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      return `AI error (${response.status}): ${errorText}`;
    }
    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || "Sorry, I couldn't get an answer from the AI.";
  } catch (e) {
    return "Sorry, there was an error contacting the AI.";
  }
}

export async function responder(question: string): Promise<string> {
  const preMade = getPreMadeAnswer(question);
  if (preMade) return preMade;
  return await askAI(question);
}
