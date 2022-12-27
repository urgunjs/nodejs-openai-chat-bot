// OpenAI API kütüphanesini dahil edin
const openai = require("openai-api");
// readline kütüphanesini dahil edin
const readline = require("readline");

// OpenAI API anahtarınızı ayarlayın
openai.apiKey = "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";

// Chat botunuzun kullanıcıdan aldığı mesajı OpenAI API'sine gönderin
async function sendMessage(message, context) {
  // İstek parametrelerini ayarlayın
  const params = {
    model: "davinci",
    prompt: message,
    temperature: 0.5,
    max_tokens: 2048,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  };

  // Eğer konuşma akışı belirtilmişse, istek parametrelerine ekleyin
  if (context) {
    params.n = 1;
    params.stop = "\n";
    params.presence_penalty = 0;
    params.best_of = 1;
    params.stream = false;
    params.stop = null;
    params.max_tokens = null;
    params.temperature = [0.5];
    params.top_p = [1];
    params.frequency_penalty = [0];
    params.presence_penalty = [0];
    params.context = context;
  }

  // İstek gönderin ve cevapları alın
  const response = await openai.completions.create(params);
  return response.choices[0].text;
}

// Chat botunuzun kullanıcıdan aldığı mesajı işleyin
async function handleMessage(message, context) {
  // Kullanıcıdan aldığınız mesajı OpenAI API'sine gönderin ve cevapları alın
  const response = await sendMessage(message, context);

  // Cevapları kullanıcı arayüzünüzde gösterin
  console.log(response);

  // Kullanıcının cevabını alın ve geçerli konuşma akışını güncelleyin
  const newContext = {
    previous_messages: [
      {
        message: message,
        sender: "user",
      },
      {
        message: response,
        sender: "bot",
      },
    ],
  };

  // Kullanıcıdan yeni bir mesaj alın ve işleyin
  const userResponse = await getUserResponse();
  handleMessage(userResponse, newContext);
}

// Kullanıcıdan mesaj alın (bu örnekte, konsol dan girdi alınır)
async function getUserResponse() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question("Kullanıcı: ", (input) => {
      rl.close();
      resolve(input);
    });
  });
}

// Chat botunuzun çalışmasını başlatın
async function main() {
  console.log("Chat bot çalıştırılıyor...");

  // Kullanıcıdan ilk mesajı alın ve işleyin
  const userResponse = await getUserResponse();
  handleMessage(userResponse);
}

main();
