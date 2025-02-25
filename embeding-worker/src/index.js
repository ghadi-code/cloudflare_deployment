export default {
	async fetch(request, env) {
	  // Parse incoming request body
	  let input;
	  try {
		input = await request.json();
	  } catch (e) {
		return new Response(JSON.stringify({ error: "Invalid JSON input" }), {
		  status: 400,
		  headers: { "Content-Type": "application/json" }
		});
	  }
  
	  // Ensure 'text' is provided and valid
	  if (!input.text || (typeof input.text !== "string" && !Array.isArray(input.text))) {
		return new Response(JSON.stringify({ error: "'text' must be a string or an array of strings." }), {
		  status: 400,
		  headers: { "Content-Type": "application/json" }
		});
	  }
  
	  // Keep only the last 100 messages if input is an array
	  const textInput = Array.isArray(input.text) ? input.text.slice(-100) : [input.text];
  
	  try {
		// Using Cloudflare's env.AI.run() to get embeddings
		const embeddings = await env.AI.run("@cf/baai/bge-large-en-v1.5", {
		  text: textInput
		});
  
		// Return the response as JSON
		return new Response(JSON.stringify({ embeddings }), {
		  status: 200,
		  headers: { "Content-Type": "application/json" }
		});
  
	  } catch (error) {
		// Handle any errors
		return new Response(JSON.stringify({ error: error.message }), {
		  status: 500,
		  headers: { "Content-Type": "application/json" }
		});
	  }
	}
  };
  