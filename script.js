(function () {
  const pages = Array.from(document.querySelectorAll(".page"));
  const appFrame = document.querySelector(".app-frame");
  const chapterJumpButtons = Array.from(document.querySelectorAll("[data-jump-chapter]"));
  const historyStack = ["home"];
  let currentPage = "home";

  const pageTitles = {
    "ch4-step1-video": "ท่าที่ 1: การนวดแก้ม (รูปตัว C)",
    "ch4-step2-video": "ท่าที่ 2: การนวดริมฝีปากบน-ล่าง",
    "ch4-step3-video": "ท่าที่ 3: การนวดรอบปาก",
    "ch4-step4-video": "ท่าที่ 4: การนวดเหงือกบน-ล่าง",
    "ch4-step5-video": "ท่าที่ 5: การนวดแก้มด้านใน",
    "ch4-step6-video": "ท่าที่ 6: การนวดขอบลิ้นด้านข้าง",
    "ch4-step7-video": "ท่าที่ 7: การนวดตรงกลางแผ่นลิ้น/เพดานแข็ง",
    "ch4-step8-video": "ท่าที่ 8: กระตุ้นการดูด (ลูบเพดานปาก)",
    "ch4-step9-video": "ท่าที่ 9: ดูดจุกนมหลอก (NNS)"
  };
  const availableVideos = new Set([
    "ch4-step1-video",
    "ch4-step2-video",
    "ch4-step3-video",
    "ch4-step4-video",
    "ch4-step5-video",
    "ch4-step6-video",
    "ch4-step7-video",
    "ch4-step8-video",
    "ch4-step9-video"
  ]);

  function showPage(pageName, pushHistory) {
    const nextPage = document.querySelector(`[data-page="${pageName}"]`);
    if (!nextPage) return;

    pages.forEach((page) => page.classList.remove("active"));
    nextPage.classList.add("active");
    currentPage = pageName;

    if (pushHistory && historyStack[historyStack.length - 1] !== pageName) {
      historyStack.push(pageName);
    }

    updateChapterJump(pageName);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function chapterForPage(pageName) {
    if (pageName.startsWith("step")) return "ch4";
    if (/^ch[1-5]$/.test(pageName)) return pageName;
    return null;
  }

  function updateChapterJump(pageName) {
    const activeChapter = chapterForPage(pageName);
    appFrame?.classList.toggle("show-chapter-jump", Boolean(activeChapter));
    chapterJumpButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.jumpChapter === activeChapter);
    });
  }

  updateChapterJump(currentPage);

  document.addEventListener("click", (event) => {
    const pageButton = event.target.closest("[data-page-target]");
    if (pageButton) {
      showPage(pageButton.dataset.pageTarget, true);
      return;
    }

    if (event.target.closest("[data-back]")) {
      if (historyStack.length > 1) {
        historyStack.pop();
        showPage(historyStack[historyStack.length - 1], false);
      } else if (currentPage !== "home") {
        showPage("home", true);
      }
    }
  });

  const modal = document.getElementById("videoModal");
  const modalTitle = document.getElementById("videoModalTitle");
  const modalPlayer = document.getElementById("videoModalPlayer");

  function openVideo(target) {
    const source = `videos/${target}.mp4`;
    modalTitle.textContent = pageTitles[target] || "วิดีโอสาธิต";
    modalPlayer.setAttribute("src", source);
    modal.hidden = false;
    if (!availableVideos.has(target)) {
      console.info(`ยังไม่มีไฟล์วิดีโอ: ${source}`);
    }
  }

  function closeVideo() {
    modalPlayer.pause();
    modalPlayer.removeAttribute("src");
    modalPlayer.load();
    modal.hidden = true;
  }

  document.addEventListener("click", (event) => {
    const videoButton = event.target.closest(".video-icon-btn");
    if (videoButton) {
      openVideo(videoButton.dataset.videoTarget);
      return;
    }

    if (event.target.closest("[data-close-video]")) {
      closeVideo();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) {
      closeVideo();
    }
  });

  const quiz = document.querySelector("[data-quiz]");
  const quizResult = document.querySelector("[data-quiz-result]");
  const resetQuizButton = document.querySelector("[data-reset-quiz]");
  const quizAnswers = {
    q1: {
      answer: "a",
      answerText: "คลอดก่อนอายุครรภ์ครบ 37 สัปดาห์",
      explanation: "เพราะนิยามของทารกคลอดก่อนกำหนดคือทารกที่คลอดก่อนอายุครรภ์ครบ 37 สัปดาห์ ซึ่งเป็นเนื้อหาหลักในบทที่ 1"
    },
    q2: {
      answer: "b",
      answerText: "32-34 สัปดาห์",
      explanation: "เพราะรีเฟล็กซ์การดูดเริ่มพบได้ก่อนหน้านั้น แต่การประสานดูด-กลืน-หายใจจะสมบูรณ์มากขึ้นช่วงประมาณ 32-34 สัปดาห์"
    },
    q3: {
      answer: "b",
      answerText: "ความคงที่ของสัญญาณชีพและอาการหายใจ",
      explanation: "เพราะก่อนกระตุ้นต้องประเมินความพร้อมของทารก โดยเฉพาะอัตราการเต้นหัวใจ การหายใจ SpO2 และอาการ apnea/bradycardia"
    },
    q4: {
      answer: "b",
      answerText: "ก่อนมื้อนมถัดไป 15-30 นาที",
      explanation: "เพราะเป็นช่วงเวลาที่เหมาะสมก่อนให้นม และควรหลีกเลี่ยงการกระตุ้นทันทีหลังให้นมเพื่อลดความเสี่ยงแหวะนมหรือสำรอก"
    },
    q5: {
      answer: "c",
      answerText: "15 นาที",
      explanation: "เพราะโปรแกรมบทที่ 4 แบ่งเป็นการนวดกระตุ้น 8 ขั้นตอนรวม 12 นาที และการดูดจุกนมหลอกแบบ NNS อีก 3 นาที รวมเป็น 15 นาที"
    }
  };

  function resetQuiz() {
    if (!quiz) return;
    quiz.reset();
    quiz.querySelectorAll(".quiz-card").forEach((card) => {
      card.classList.remove("correct", "incorrect");
      card.querySelector(".quiz-explanation")?.remove();
    });
    if (quizResult) {
      quizResult.textContent = "";
    }
  }

  if (quiz) {
    quiz.addEventListener("submit", (event) => {
      event.preventDefault();
      let score = 0;
      const total = Object.keys(quizAnswers).length;

      Object.entries(quizAnswers).forEach(([name, item]) => {
        const selected = quiz.querySelector(`input[name="${name}"]:checked`);
        const card = quiz.querySelector(`input[name="${name}"]`)?.closest(".quiz-card");
        const isCorrect = selected?.value === item.answer;

        if (isCorrect) score += 1;
        if (card) {
          card.classList.toggle("correct", isCorrect);
          card.classList.toggle("incorrect", !isCorrect);
          card.querySelector(".quiz-explanation")?.remove();

          const explanation = document.createElement("div");
          explanation.className = "quiz-explanation";
          explanation.innerHTML = `
            <strong>${isCorrect ? "ตอบถูก" : "เฉลย: " + item.answerText}</strong>
            <p>${item.explanation}</p>
          `;
          card.appendChild(explanation);
        }
      });

      quizResult.textContent = `ได้ ${score}/${total} คะแนน ทบทวนเฉลยและคำอธิบายใต้แต่ละข้อ`;
    });
  }

  if (resetQuizButton) {
    resetQuizButton.addEventListener("click", resetQuiz);
  }
}());
