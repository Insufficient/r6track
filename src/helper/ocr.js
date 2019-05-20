const Form = require("form-data");
require("dotenv").config();

const API_KEY = process.env.REACT_APP_OCR_KEY;
const URL = "https://api.ocr.space/parse/imagex";

export default async function ocrImg(imgData) {
  let form = new Form();
  form.append("language", "eng");
  form.append("isOverlayRequired", "false");
  form.append("base64Image", imgData);

  try {
    const resp = await fetch(URL, {
      method: "POST",
      body: form,
      headers: {
        apikey: API_KEY
      }
    });
    const json = await resp.json();
    const res = json["ParsedResults"][0]["ParsedText"];
    return res.split(/\s+\n/);
  } catch (e) {
    alert(e);
    console.log(e);
    return [];
  }
}
