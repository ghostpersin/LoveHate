import cohere
from django.conf import settings
from django.http import JsonResponse

co = cohere.Client(settings.COHERE_API_KEY)

def generate_response(prompt, mode):
    # Define input_text based on the mode
    if mode == "rap":
        input_text = f"Generate a cringe-worthy Valentine's rap verse: {prompt}"
    elif mode == "argument":
        input_text = f"Debate this topic: {prompt}"
    elif mode == "flirt":
        input_text = f"Generate a flirty message and a rejection response: {prompt}"
    else:
        # Handle unexpected mode values
        return "Invalid mode selected. Please choose 'rap', 'argument', or 'flirt'."

    try:
        response = co.generate(
            model='command', 
            prompt=input_text,
            max_tokens=100,
            temperature=0.7, 
        )
        return response.generations[0].text
    except Exception as e:
        print(f"Error: {e}")
        return "An error occurred while generating the response."

def bot_response(request):
    mode = request.GET.get('mode')
    prompt = request.GET.get('prompt')
    response = generate_response(prompt, mode)  # Fix: Pass prompt first, then mode
    return JsonResponse({'response': response})