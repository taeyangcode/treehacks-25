"use client"
import React, { useState } from "react";




export default function Home() {
  const [formData, setFormData] = useState({ param1: "", param2: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Calling backend now")
    try {
      const res = await fetch("http://127.0.0.1:5000/api/scrape/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log("Response received")
      console.log(data)
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div>
      Hello
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="param1"
          placeholder="Enter param1"
          value={formData.param1}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="param2"
          placeholder="Enter param2"
          value={formData.param2}
          onChange={handleChange}
          required
        />
        <button type="submit" >Submit</button>
      </form>
    </div>
  );
}
