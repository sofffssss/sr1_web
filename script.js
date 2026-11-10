// ==================== БАЗОВИЙ КЛАС ====================
class Product {
  constructor(name, category) {
      this.name = name;
      
      if (typeof category === "string") {
          this.category = category.toLowerCase();
      } else {
          this.category = "other";
      }
  }
}

const products = [];

function showHeader() {
  const header = document.querySelector("#header");

  const h1 = document.createElement("h1");
  h1.innerText = "Самостійна робота №1. Робота з хмарними сховищами";
  header.appendChild(h1);

  const p = document.createElement("p");
  p.innerText = "Виконала студентка: Ткачук Софія | Група: АнД-31 | Варіант: 10";
  header.appendChild(p);
}

// ==================== ФУНКЦІЯ ДЛЯ СТВОРЕННЯ КЛАСУ ====================
function newProduct(obj) {
  const { name, category } = obj;
  return new Product(name, category);
}

// ==================== ВИВЕДЕННЯ ДАНИХ ====================
function showProducts() {
  const main = document.querySelector("#content");
  main.innerHTML = "";

  const h2 = document.createElement("h2");
  h2.innerText = "Список товарів";
  main.appendChild(h2);

  const container = document.createElement("div");
  container.className = "groups-container";

  // Групи
  const groups = [
      { key: "food", title: "Продукти", className: "food" },
      { key: "industrial", title: "Промислові товари", className: "industrial" },
      { key: "other", title: "Інші товари", className: "other" }
  ];

  for (const group of groups) {
      const div = document.createElement("div");
      div.className = "group " + group.className;

      const h3 = document.createElement("h3");
      h3.innerText = group.title;
      div.appendChild(h3);

      const ul = document.createElement("ul");
      const filtered = products.filter(p => p.category === group.key);

      if (filtered.length === 0) {
          const li = document.createElement("li");
          li.innerText = "Немає товарів";
          ul.appendChild(li);
      } else {
          for (const product of filtered) {
              const li = document.createElement("li");
              li.innerText = product.name;
              ul.appendChild(li);
          }
      }

      div.appendChild(ul);
      container.appendChild(div);
  }

  main.appendChild(container);
}

// ==================== РОБОТА З ХМАРНИМ СХОВИЩЕМ ====================
async function populate() {

  const url = "https://api.jsonbin.io/v3/b/6af31faeac6210605a7d0e98/latest";

  try {
      const content = document.querySelector("#content");
      content.innerHTML = '<p id="loading">Завантаження даних...</p>';

      const request = new Request(url, {
          method: "GET",
          headers: {
              "X-Master-Key": "$2a$10$fAEZIWjZ5l0y79Z6avp38O8uMVI4vecca2yC7sghkYIP.CdyYFuRK",
              "X-Bin-Meta": "false"
          }
      });

      const response = await fetch(request);

      if (response.ok) {
          const json = await response.json();

          // Очищення масиву перед заповненням
          products.length = 0;

          // Отримуємо масив товарів
          const items = Array.isArray(json) ? json : json.products || json.record || [];

          for (const item of items) {
              const product = newProduct(item);
              products.push(product);
          }

          showHeader();
          showProducts();
      } else {
          document.querySelector("#content").innerHTML =
              '<p id="error">Помилка HTTP: ' + response.status + "</p>";
          showHeader();
      }
  } catch (error) {
      showHeader();
      document.querySelector("#content").innerHTML =
          '<p id="error">Помилка завантаження: ' + error.message + "</p>";
  }
}

populate();