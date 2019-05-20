# Rainbow Six Track

This is project that allows users to upload a screenshot of their Rainbow Six Siege scoreboard and obtain information about
the players currently in-game. It does so by using OCR (Optical Character Recognition) via [ocr.space](https://ocr.space) to retrieve
player names and queries for their data via [R6Tab](https://wwww.r6tab.com).

This is a personal project so that I can learn a bit more about React and APIs in general.

## Demo

[Netlify](https://r6track.netlify.com)

## Notes

- Since R6Tab API does not return CORS headers, a [reverse proxy service](https://cors-anywhere.herokuapp.com) is used.
- No testing or error handling means that things will fail :(
- ocr.space has API limits of 500 requests per IP, per day with a total of 25000 requests per month.

## Instructions

ocr.space API key is not provided, create a file named `.env` containing `REACT_APP_OCR_KEY=YOUR_API_KEY`
