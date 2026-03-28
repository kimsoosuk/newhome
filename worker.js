// Cloudflare Worker: 김수석 선생님 AI 채팅 (Gemini 3.1)
// Deploy to: https://home.kimsoosuk1.workers.dev/

export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'POST only' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    try {
      // 사용자가 Cloudflare 대시보드에 변수명을 'kimsoosuk'으로 저장했을 수 있음
      const geminiApiKey = env.GEMINI_API_KEY || env.kimsoosuk;

      if (!geminiApiKey) {
        throw new Error('GEMINI_API_KEY or kimsoosuk is not configured in Cloudflare Variables');
      }

      const body = await request.json();
      const { messages, apiKey } = body;

      if (apiKey !== 'kimsoosuk') {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const systemPrompt = `당신은 김수석 선생님입니다. 공부법을 가르치며 학생의 마음을 다독이는 멘토입니다.

성격 및 대화 가이드:
- 절대로 사용자를 '학생'이라고 부르지 마세요. 그냥 부드러운 반말을 사용하세요.
- 본인을 지칭할 때 '수석이가~' 라는 표현을 쓰지 마세요. '선생님이~' 혹은 '내가~' 라는 지칭하는 표현도 쓰지 마세요.
- 답변은 무조건 1~2문장으로 아주 짧고 간결하게 작성하세요. 절대 길게 말하지 마세요.
- 질문이나 고민을 들었을 때 바로 완성된 해결책을 던져주기보다는, 먼저 공감하고 상대방의 생각이나 기분을 물어보는 질문을 던져주세요.
- "~해봐", "~하자", "~거야" 등 부드럽고 친근한 반말체를 사용하세요.

전문 분야:
- 공부법, 학습 습관, 멘탈 관리

규칙:
- 항상 한국어로 답변
- 무조건 1~2문장 이내로 짧게 대답할 것.
- "수석의방"이나 프로그램에 대해 물을 때만 가볍게 안내.`;

      // Gemini 3.1 Flash Lite Preview API용 메시지 변환
      const geminiContents = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      }));

      // Gemini 3.1 Flash Lite Preview API 호출
      const modelName = 'gemini-3.1-flash-lite-preview';
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiApiKey}`;

      const geminiResponse = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemPrompt }]
          },
          contents: geminiContents,
          generationConfig: {
            temperature: 0.8,
            topP: 0.9,
            topK: 40,
            maxOutputTokens: 512,
          },
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
          ],
        }),
      });

      const geminiData = await geminiResponse.json();

      let reply = '미안, 지금은 답변이 어려워. 잠시 후에 다시 물어봐줄래?';

      if (
        geminiData.candidates &&
        geminiData.candidates[0] &&
        geminiData.candidates[0].content &&
        geminiData.candidates[0].content.parts
      ) {
        reply = geminiData.candidates[0].content.parts[0].text;
      }

      return new Response(JSON.stringify({ reply }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (err) {
      console.error('Worker Catch Error:', err.message);
      return new Response(
        JSON.stringify({
          reply: '미안, 지금은 답변이 어려워. 잠시 후에 다시 물어봐줄래?',
          error: err.message
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
  },
};
