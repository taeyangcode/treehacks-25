from dotenv import load_dotenv
import requests
import os
import json
import groq
from pydantic import BaseModel
from flask import Flask, Response

load_dotenv()


class MandASchema(BaseModel):
    company_acquired: str
    acquiring_company: str
    deal_value: int
    date: str

def stream_groq_response(article_text):
    # TODO: parameter of adding user-defined schema 

    print("Received call request")
    def generate_response():
        print("Initializing groq instances")

        groq_key = os.getenv("GROQAPIKEY")
        client = groq.Client(api_key=groq_key)
        
        headers = {"Authorization": f"Bearer {groq_key}", "Content-Type": "application/json"}
        print("setting up parameters")

        response = client.chat.completions.create(
            model="llama3-70b-8192", 
            messages=[
                {
                    "role": "system", 
                    "content": f"""
                                You extract mergers and acquisitions information formatted as schema defined rows from user given text. 
                                You are in streaming mode 
                                Only output each data chunk as a row following the below schema. 
                                The schema is the following: acquired company (str) / acquiring company (str) / price_value (int) / date
                                Don't output any other kind of text
                                Note that this given text is all text in a webpage and can contain irrelevant info such as ads.
                                """
                },
                {
                    "role": "user", "content": article_text
                }
            ],
            stream=True,  # Enable streaming responses,
        )
        print("Initializing groq streamed response \n")

        # Process the response stream
        print("GROQ OUTPUT")
        for chunk in response:
            # Extract and print the message content incrementally
            if chunk:
                print(chunk.choices[0].delta.content, end="")
                # yield f"data: {data} \n\n" # Send each chunk as a Server-Sent-Event message
                # print(chunk.choices[0].delta.content, end="")
    

    generate_response()
    print("")
    # return Response(generate_response(), content_type='text/event-stream')
    return 