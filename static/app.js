async function checkToxicity() {
  const text = document.getElementById("input").value.trim();
  const resultBox = document.getElementById("result");
  const bar = document.getElementById("toxicity-bar");

  if (!text) {
    resultBox.innerHTML = "Please enter something to analyze.";
    bar.style.width = "0%";
    return;
  }

  resultBox.innerHTML = "Checking...";

  try {
    const res = await fetch(CONFIG.API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });

    const data = await res.json();
    
    // Round probability to 2 decimal places
    // const formattedScore = Math.round(data.probability * 100) / 100;
    const scorePercent = Math.round(data.probability * 100);
    
    // Enhanced response messages - pre-formatted with line breaks
    if (data.prediction === 1) {
      // Toxic responses (score > 0.3)
      const toxicResponses = [
        `<div class="result-heading">YIKES!: ${scorePercent}%</div>
         <div class="result-details">HR would like a word with you... immediately! 🚨</div>`,
        `<div class="result-heading">RED ALERT: ${scorePercent}%</div>
         <div class="result-details">That's desk-cleaning territory. 📦</div>`,
        `<div class="result-heading">DANGER ZONE: ${scorePercent}%</div>
         <div class="result-details">Save this one for your private thoughts! 🔥</div>`,
        `<div class="result-heading">HOT POTATO: ${scorePercent}%</div>
         <div class="result-details">The office isn't ready for this heat! 🌶️🌶️🌶️</div>`,
        `<div class="result-heading">WHOA THERE: ${scorePercent}%</div>
         <div class="result-details">This would make your work chat go silent for days! 😶</div>`
      ];
      resultBox.innerHTML = toxicResponses[Math.floor(Math.random() * toxicResponses.length)];
    } else if (data.probability > 0.2) {
      // Borderline responses (score 0.2-0.3)
      const borderlineResponses = [
        `<div class="result-heading">PROCEED WITH CAUTION: ${scorePercent}%</div>
         <div class="result-details">Maybe test this on a close colleague first? 🤔</div>`,
        `<div class="result-heading">BORDERLINE: ${scorePercent}%</div>
         <div class="result-details">Depends who's in the room... 👀</div>`,
        `<div class="result-heading">QUESTIONABLE: ${scorePercent}%</div>
         <div class="result-details">Could go either way. Know your audience! 🤷‍♂️</div>`,
        `<div class="result-heading">EDGY: ${scorePercent}%</div>
         <div class="result-details">Only use after confirming everyone's sense of humor! 😏</div>`,
        `<div class="result-heading">TREAD LIGHTLY: ${scorePercent}%</div>
         <div class="result-details">OK for some workplaces, career-limiting for others! ⚠️</div>`
      ];
      resultBox.innerHTML = borderlineResponses[Math.floor(Math.random() * borderlineResponses.length)];
    } else {
      // Clean responses (score < 0.2)
      const cleanResponses = [
        `<div class="result-heading">ALL CLEAR: ${scorePercent}%</div>
         <div class="result-details">Corporate-approved communication! ✅</div>`,
        `<div class="result-heading">SQUEAKY CLEAN: ${scorePercent}%</div>
         <div class="result-details">Even your boss's boss would approve. 👔</div>`,
        `<div class="result-heading">PERFECTLY SAFE: ${scorePercent}%</div>
         <div class="result-details">Could put this in the company newsletter! 📰</div>`,
        `<div class="result-heading">GREEN LIGHT: ${scorePercent}%</div>
         <div class="result-details">Send it to the whole team with confidence! 🟢</div>`,
        `<div class="result-heading">PRISTINE: ${scorePercent}%</div>
         <div class="result-details">So wholesome you could say it in a board meeting! 💯</div>`
      ];
      resultBox.innerHTML = cleanResponses[Math.floor(Math.random() * cleanResponses.length)];
    }

    bar.style.width = `${scorePercent}%`;

  } catch (error) {
    resultBox.innerHTML = `<div class="result-heading">ERROR</div>
                          <div class="result-details">Is your roast too powerful for our servers? 💥</div>`;
    console.error(error);
    bar.style.width = "0%";
  }
}