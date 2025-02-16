from dotenv import load_dotenv
import requests
import os
import json
import groq
from pydantic import BaseModel, create_model
from flask import Flask, Response, request
from typing import Dict, Any, Type


load_dotenv()

def groq_response(custom_schema: Type[BaseModel], article_text: str):
    # TODO: parameter of adding user-defined schema 

    groq_key = os.getenv("GROQAPIKEY")
    client = groq.Client(api_key=groq_key)


    # Dynamically changing user schema
    # user_schema: Dict[str, str] = request.json.get("schema", {})
    # DynamicSchema = create_model("DynamicSchema", **{key: (eval(value), ...) for key, value in user_schema.items()})
    # class RowList(BaseModel):
    #     row_list: list[DynamicSchema]  # Enforce list of rows
        
    print("setting up parameters")
    print(f"Schema Class: {custom_schema}")
    print(f"Schema Fields: {custom_schema.__annotations__}")
    chat_completion = client.chat.completions.create(
        model="deepseek-r1-distill-llama-70b", 
        messages=[
            {
                "role": "system", 
                "content": """
                    You extract mergers and acquisitions information formatted as schema defined rows from user given text. 
                    You are in streaming mode 
                    Only output each data chunk as a row following the below schema. 
                    Don't output any other kind of text
                    Note that this given text is all text in a webpage and can contain irrelevant info such as ads.\n """
                    f"The JSON object must use the schema enforcing the data types: {json.dumps(custom_schema.model_json_schema(), indent=2)}"
            },
            {
                "role": "user", "content": article_text[:15000]
            }
        ],
        stream=False,
        response_format={"type": "json_object"},
    )

    response_content = custom_schema.model_validate_json(chat_completion.choices[0].message.content)
    print("Output received from groq")

    return response_content
