const { HfInference } = require('@huggingface/inference');

// Initialize the client using process.env.HF_API_TOKEN
const hf = new HfInference(process.env.HF_API_TOKEN);

/**
 * Sends a text prompt to a Hugging Face chat model and returns the response.
 * @param {string} prompt - The customer's prompt text.
 * @returns {Promise<string>} The AI response content.
 */
async function chatWithCustomer(prompt) {
  if (!prompt || typeof prompt !== 'string') {
    throw new Error('Invalid prompt: Prompt must be a non-empty string.');
  }

  try {
    const response = await hf.chatCompletion({
      model: 'Qwen/Qwen2.5-72B-Instruct',
      messages: [
        { role: 'user', content: prompt }
      ],
      max_tokens: 1000
    });

    if (response && response.choices && response.choices.length > 0) {
      return response.choices[0].message.content;
    } else {
      throw new Error('No response returned from Hugging Face chat completion.');
    }
  } catch (error) {
    console.error('Error in Hugging Face chatWithCustomer service:', error);
    throw error;
  }
}

module.exports = {
  chatWithCustomer
};
