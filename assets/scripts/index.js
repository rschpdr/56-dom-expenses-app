// Criar um novo item na lista

// Selecionando os elementos importantes
const descriptionInputElement = document.getElementById("formDescription");
const valueInputElement = document.getElementById("formValue");
const transactionTypeCreditElement = document.getElementById(
  "formTransactionTypeCredit"
);
const transactionTypeDebitElement = document.getElementById(
  "formTransactionTypeDebit"
);
const submitBtnElement = document.getElementById("submitBtn");
const transactionListElement = document.getElementById("transactionList");
const balanceElement = document.getElementById("balance");

function extractValues() {
  const description = descriptionInputElement.value;
  let amount = valueInputElement.valueAsNumber;

  const transactionType = transactionTypeDebitElement.checked
    ? transactionTypeDebitElement.value
    : transactionTypeCreditElement.value;

  return {
    description: description,
    amount: amount,
    transactionType: transactionType,
  };
}

function validate(description, amount) {
  if (
    !description ||
    !amount ||
    (!transactionTypeDebitElement.checked &&
      !transactionTypeCreditElement.checked)
  ) {
    alert("Preencha todos os campos antes de salvar!");
    return false;
  }

  return true;
}

function verifyTransactionType(transactionType, amount) {
  // Por padrão o texto da transação será verde
  let transactionTypeClass = "success";

  if (transactionType === "debit") {
    amount = amount * -1;
    // Se for um débito, o texto passa a ser vermelho
    transactionTypeClass = "danger";
  }

  return { transactionTypeClass: transactionTypeClass, amount: amount };
}

function createListItem(description, transactionTypeClass, amount) {
  const li = `<li class="list-group-item d-flex justify-content-between">
  
  ${description} <div><span class="text-${transactionTypeClass}">${amount.toFixed(
    2
  )}</span>
  <button class="btn btn-danger">-</button>
  </div>
</li>`;

  return li;
}

function updateList(listItem) {
  transactionListElement.insertAdjacentHTML("beforeend", listItem);
}

function updateBalance(amount) {
  balanceElement.innerText = (
    parseFloat(balanceElement.innerText) + amount
  ).toFixed(2);
}

function clearForm() {
  descriptionInputElement.value = "";
  valueInputElement.value = "";
  transactionTypeDebitElement.checked = false;
  transactionTypeCreditElement.checked = false;
}

submitBtnElement.addEventListener("click", () => {
  // Extrair os valores dos inputs
  // Usando desestruturação de objeto
  const { description, amount, transactionType } = extractValues();

  // Verificando se qualquer um dos campos está vazio e encerrando prematuramente caso estejam
  if (!validate(description, amount)) {
    return;
  }

  // Verificar se é um gasto ou um ganho
  const { transactionTypeClass, amount: updatedAmount } = verifyTransactionType(
    transactionType,
    amount
  );

  // Criar o novo item da lista usando os valores dos inputs
  const li = createListItem(description, transactionTypeClass, updatedAmount);

  // Concantenando o novo li com o innerHTML da lista
  // transactionListElement.innerHTML += li;

  // Inserindo o novo li depois do último filho da lista
  updateList(li);

  // Atualizar o saldo
  updateBalance(updatedAmount);

  // Limpando o formulário
  clearForm();
});

// Event bubbling: no DOM, alguns eventos disparados "sobem" de elemento pai em elemento pai até serem capturados por um eventListener ou até chegarem no document.
// Delegação de eventos (event delegation)
document.addEventListener("click", (event) => {
  // Verificando se o elemento que disparou o evento é o botão de deletar
  if (event.target.innerText === "-") {
    const li = event.target.parentElement.parentElement;

    transactionListElement.removeChild(li);

    // Extrair o valor usando o previousSibling, que é a tag <span> com o valor
    const amount = parseFloat(event.target.previousElementSibling.innerText);

    // Invertendo o sinal para somar caso tenha sido um débito ou subtrair caso tenha sido um crédito
    updateBalance(amount * -1);
  }
});
