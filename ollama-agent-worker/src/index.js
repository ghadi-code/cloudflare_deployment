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
  
	  // Ensure messages array is provided
	  if (!input.messages || !Array.isArray(input.messages)) {
		return new Response(JSON.stringify({ error: "Messages array is required" }), {
		  status: 400,
		  headers: { "Content-Type": "application/json" }
		});
	  }
  
	  // Keep only the last 5 messages
	  const messages = input.messages.slice(-5);
  
	  // Using Cloudflare's env.AI.run() to get the response (No streaming)
	  try {
		const response = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
		  messages,
		  stream: false    // Disabling streaming
		});
  
		// Return the response as JSON
		return new Response(JSON.stringify({ response }), {
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
  