const API = "http://localhost:8000/tweet";

let inpHeader = document.getElementById("inpHeader");
let inpContent = document.getElementById("inpContent");
let inpImage = document.getElementById("inpImage");
let inpComment = document.getElementById("inpComment");
let btnAdd = document.getElementById("btnAdd");
let sectionPosts = document.getElementById("sectionPosts");
let btnOpenForm = document.getElementById("flush-collapseOne");
let searchValue = "";
let currentPage = 1;
let countPage = 1;

//!  Добавление

btnAdd.addEventListener("click", (e) => {
  e.preventDefault();
  if (
    !inpHeader.value.trim() ||
    !inpContent.value.trim() ||
    !inpImage.value.trim() ||
    !inpComment.value.trim()
  ) {
    alert("Заполните поле!");
    return;
  }
  let newPost = {
    postHeader: inpHeader.value,
    postContent: inpContent.value,
    postImage: inpImage.value,
    postComment: inpComment.value,
  };
  createPosts(newPost);
});

// ! CREATE

function createPosts(posts) {
  console.log(posts);

  fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(posts),
  }).then(() => readPosts());

  inpHeader.value = "";
  inpContent.value = "";
  inpImage.value = "";
  inpComment.value = "";
}

// ! READ

function readPosts() {
  fetch(`${API}?q=${searchValue}&_page=${currentPage}&_limit=2`)
    .then((res) => res.json())
    .then((data) => {
      sectionPosts.innerHTML = "";
      data.forEach((item) => {
        sectionPosts.innerHTML += `
        <div class="card mt-3" style="width: 33rem;">
        <img src="${item.postImage}" class="card-img-top" style="height:350px" alt="${item.postHeader}">
         <div class="card-body">
        <h5 class="card-title">${item.postHeader}</h5>
        <p class="card-text">${item.postContent}</p>
        <p class="card-text">${item.postComment}</p>
        <button class="btn btn-outline-danger btnDelete" id="${item.id}">
        Удалить
        </button>
        <button class="btn btn-outline-warning btnEdit" id="${item.id}" data-bs-toggle="modal"
        data-bs-target="#exampleModal">
        Изменить
        </button>
        </div>
        </div>
        `;
      });
      sumPage();
    });
}
readPosts();

// ! DELETE
document.addEventListener("click", (event) => {
  let del_class = [...event.target.classList];
  if (del_class.includes("btnDelete")) {
    let del_id = event.target.id;
    fetch(`${API}/${del_id}`, {
      method: "DELETE",
    }).then(() => readPosts());
  }
});

// ! EDIT

let editInpHeader = document.getElementById("editInpHeader");
let editInpContent = document.getElementById("editInpContent");
let editInpImage = document.getElementById("editInpImage");
let editInpComment = document.getElementById("editInpComment");
let editBtnSave = document.getElementById("editBtnSave");

document.addEventListener("click", (event) => {
  let editArr = [...event.target.classList];

  if (editArr.includes("btnEdit")) {
    let id = event.target.id;
    fetch(`${API}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        editInpHeader.value = data.postHeader;
        editInpContent.value = data.postContent;
        editInpImage.value = data.postImage;
        editInpComment.value = data.postComment;

        editBtnSave.setAttribute("id", data.id);
      });
  }
});

editBtnSave.addEventListener("click", () => {
  let editedPost = {
    postHeader: editInpHeader.value,
    postContent: editInpContent.value,
    postImage: editInpImage.value,
    postComment: editInpComment.value,
  };
  editPosts(editedPost, editBtnSave.id);
});

function editPosts(objEditPost, id) {
  fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charse=utf-8",
    },
    body: JSON.stringify(objEditPost),
  }).then(() => readPosts());
}

// //!  SEARCH

let inputSearch = document.getElementById("inputSearch");

inputSearch.addEventListener("input", (event) => {
  searchValue = event.target.value;
  readPosts();
});

//! PAGINATION

let backBtn = document.getElementById("backBtn");
let nextBtn = document.getElementById("nextBtn");

backBtn.addEventListener("click", () => {
  if (currentPage <= 1) return;
  currentPage = currentPage - 1;
  readPosts();
});

nextBtn.addEventListener("click", () => {
  if (currentPage >= countPage) return;
  currentPage = currentPage + 1;
  readPosts();
});

function sumPage() {
  fetch(API)
    .then((res) => res.json())
    .then((data) => {
      countPage = Math.ceil(data.length / 2);
    });
}
