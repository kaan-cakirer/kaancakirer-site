let kullaniciAdi = "";

const loginScreen = document.getElementById("login-screen");
const mainContent = document.getElementById("main-content");
const loginButton = document.getElementById("login-btn");
const nameInput = document.getElementById("name-input");
const greetMessage = document.getElementById("greet-msg");
const logoutBtn = document.getElementById("logout-btn");

nameInput.addEventListener("keydown", function(e){
  if(e.key === "Enter"){
    loginButton.click();
  }
});

loginButton.addEventListener("click", function () {
  const name = nameInput.value.trim();
  if (name) {
    kullaniciAdi = name;
    loginScreen.style.display = "none";
    mainContent.style.display = "block";
    document.getElementById("notes-container").innerHTML = "";
    loadNotes();

    logoutBtn.style.display ="inline-flex";
  }
});

function loadNotes() {
  let notlar = JSON.parse(localStorage.getItem("notlar")) || [];
  document.getElementById("notes-container").innerHTML = ""; 
  notlar.forEach(function(not, index) {
    const div = document.createElement("div");
    div.classList.add("note-box");
    let replyBtnHTML = "";
    if (kullaniciAdi === "Kaan") {
      replyBtnHTML = `<button class="rply-btn">Yanıtla</button>`;
    }  
    div.innerHTML = `${not.icerik}<button class="delete-btn">✖</button>${replyBtnHTML} <small class="note-author">${not.yazar}</small> <small class="note-date">${not.tarih}</small><div class ="replies"></div>`;

    const repliesDiv = div.querySelector(".replies");
    if(not.replies && not.replies.length > 0){
      not.replies.forEach(function(reply){
        let deleteBtn = "";
        if (kullaniciAdi === "Kaan") {
          deleteBtn = `<button class="delete-reply-btn">✖</button>`;
        }
        repliesDiv.insertAdjacentHTML("beforeend", `<div class="reply">${reply}${deleteBtn}</div>`);
      });
    }

    const replyBtn = div.querySelector('.rply-btn');
    if(replyBtn){
      replyBtn.addEventListener('click', function(){
        if(div.querySelector('.reply-input')) return;
        div.insertAdjacentHTML("beforeend", `<input type="text" class="reply-input" placeholder="Yanıt yaz..."><button class="send-reply-btn">Gönder</button>`);
        const replyInput = div.querySelector(".reply-input");
        const sendReplyBtn = div.querySelector(".send-reply-btn");
        sendReplyBtn.addEventListener("click", function(){
          const cevap = replyInput.value.trim();
          if (!cevap) return;
          let notlarGuncel = JSON.parse(localStorage.getItem("notlar")) || [];
          notlarGuncel[index].replies = notlarGuncel[index].replies || [];
          notlarGuncel[index].replies.push(cevap);
          localStorage.setItem("notlar", JSON.stringify(notlarGuncel));
          let deleteBtn = "";
          if (kullaniciAdi === "Kaan") {
            deleteBtn = `<button class="delete-reply-btn">✖</button>`;
          }
          repliesDiv.insertAdjacentHTML("beforeend", `<div class="reply">${cevap}${deleteBtn}</div>`);
          if (kullaniciAdi === "Kaan") {
            const newDeleteBtn = repliesDiv.lastElementChild.querySelector('.delete-reply-btn');
            newDeleteBtn && newDeleteBtn.addEventListener("click", function() {
              if(confirm("Bu Yanıtı Silmek İstediğinize Emin Misiniz?")){
              const replyDiv = newDeleteBtn.closest(".reply");
              const replyText = replyDiv.childNodes[0].textContent.trim();
              replyDiv.remove();
              let notlarGuncel = JSON.parse(localStorage.getItem("notlar")) || [];
              notlarGuncel[index].replies = notlarGuncel[index].replies.filter(r => r !== replyText);
              localStorage.setItem("notlar", JSON.stringify(notlarGuncel));
              }
            });
          }
          replyInput.remove();
          sendReplyBtn.remove();
        });
        replyInput.addEventListener("keydown", function(e){
  if(e.key === "Enter"){
    sendReplyBtn.click();
    e.preventDefault();
  }
});
      });
    }

    const deleteBtn = div.querySelector(".delete-btn");
    if (kullaniciAdi === "Kaan") {
      deleteBtn.addEventListener("click", function() {
        if(confirm("Bu Mesajı Silmek İstediğinize Emin Misiniz?")){
          notlar = notlar.filter(n => !(n.icerik === not.icerik && n.yazar === not.yazar));
          localStorage.setItem("notlar", JSON.stringify(notlar));
          div.remove();
        }
      });
    } else {
      deleteBtn.remove(); 
    }

    if (kullaniciAdi === "Kaan") {
      repliesDiv.querySelectorAll(".delete-reply-btn").forEach(function(deleteRplyBtn) {
        deleteRplyBtn.addEventListener("click", function() {
          if(confirm("Bu Yanıtı Silmek İstediğinize Emin Misiniz?")){
            const replyDiv = deleteRplyBtn.closest(".reply");
            const replyText = replyDiv.childNodes[0].textContent.trim();
            replyDiv.remove();
            let notlarGuncel = JSON.parse(localStorage.getItem("notlar")) || [];
            notlarGuncel[index].replies = notlarGuncel[index].replies.filter(r => r !== replyText);
            localStorage.setItem("notlar", JSON.stringify(notlarGuncel));
          }
        });
      });
    } else {
      repliesDiv.querySelectorAll(".delete-reply-btn").forEach(function(btn){ btn.remove(); });
    }
    document.getElementById("notes-container").appendChild(div);
  });
}

const icon= document.getElementById("theme-icon")
const btn = document.getElementById("theme-toggle");

btn.addEventListener("click", function() {
  document.body.classList.toggle("dark-mode");
});

const greetButton = document.getElementById("greet-btn");

greetButton.addEventListener("click", function () {
  if (!greetMessage.textContent.trim()) {
    const name = nameInput.value.trim();
    greetMessage.textContent = name ? `Merhaba ${name}!` : "Merhaba!";
  };
});

const noteInput = document.getElementById("note-input");
const charCount = document.getElementById("char-count");
const noteButton = document.getElementById("add-note");

const bugun = new Date();
const gun = bugun.getDate();
const ay = bugun.getMonth() + 1;
const yil = bugun.getFullYear();

const tarih = `${gun}.${ay}.${yil}`;

noteInput.addEventListener("input",function(){
  let length = noteInput.value.length;
  charCount.textContent = `${length}/100`;
  if (length===100){
    charCount.style.color="red";
  } else {
    charCount.style.color = "";
  };
});
noteButton.addEventListener("click", function(){
  let replyBtnHTML = "";
  if (kullaniciAdi === "Kaan") {
    replyBtnHTML = `<button class="rply-btn">Yanıtla</button>`;
  }
  const notMetni = noteInput.value.trim();
  if(notMetni.length === 0) return;
  let notlar = JSON.parse(localStorage.getItem("notlar")) || [];
  const notObjesi = {
    yazar: kullaniciAdi,
    icerik: notMetni,
    tarih: tarih,
    replies: []
  };
  notlar.push(notObjesi);
  localStorage.setItem("notlar", JSON.stringify(notlar));
  loadNotes();
  noteInput.value = "";
  charCount.textContent = "0/100";
  charCount.style.color = "";
});

window.addEventListener("load", function(){
  kullaniciAdi = "";
  loginScreen.style.display = "flex";
  mainContent.style.display = "none";

  if(logoutBtn) logoutBtn.style.display ="none";
});

noteInput.addEventListener("keydown", function(e){
  if(e.key === "Enter"){
    noteButton.click();
    e.preventDefault();
  }
});

logoutBtn.addEventListener("click", function(){
    kullaniciAdi = "";
    mainContent.style.display = "none";
    loginScreen.style.display = "flex";
    logoutBtn.style.display = "none";
    nameInput.value = "";
    nameInput.focus();
})