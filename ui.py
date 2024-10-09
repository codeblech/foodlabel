import streamlit as st
import google.generativeai as genai
import os
from dotenv import load_dotenv
import requests
from bs4 import BeautifulSoup

load_dotenv()
api_key = os.getenv("API_KEY")
genai.configure(api_key=api_key)

model = genai.GenerativeModel('gemini-1.5-flash')

def feed_link(link):
    try:
        response = requests.get(link)
        soup = BeautifulSoup(response.text, 'html.parser')
        text = soup.get_text(separator=' ', strip=True)
        
        max_chars = 10000  
        if len(text) > max_chars:
            text = text[:max_chars] + "..."
    
        st.session_state.webpage_content = text
        
        return "Link processed successfully. You can now ask questions about its content."
    except Exception as e:
        return f"Error processing the link: {str(e)}"

def get_gemini_response(question, chat_history):
    messages = [{'role': 'user' if i % 2 == 0 else 'model', 'parts': [msg]} 
                for i, msg in enumerate(chat_history + [question])]
    if 'webpage_content' in st.session_state:
        context = f"Context from the provided link: {st.session_state.webpage_content}\n\nQuestion: {question}"
        messages.append({'role': 'user', 'parts': [context]})
    
    response = model.generate_content(messages)
    return response.text

st.title("Chatbot with Gemini AI and Link Processing")
if "messages" not in st.session_state:
    st.session_state.messages = []
if "webpage_content" not in st.session_state:
    st.session_state.webpage_content = None

link = st.text_input("Enter a link to process (optional):")
if link:
    result = feed_link(link)
    st.write(result)

for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

if prompt := st.chat_input("What would you like to know?"):
    st.chat_message("user").markdown(prompt)
    st.session_state.messages.append({"role": "user", "content": prompt})
    response = get_gemini_response(prompt, [m["content"] for m in st.session_state.messages])
    with st.chat_message("assistant"):
        st.markdown(response)
    
    st.session_state.messages.append({"role": "assistant", "content": response})