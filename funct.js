$(document).ready(function() {
  populateFields();
  $("#tab1, #tab2").on("click", switchTabs);
});

$(document).on("change", "select, input[type='number']", function() {
  updateNetWorth();
  updateField(this.id);
});

function switchTabs() {
  $("#properties-tab, #cash-tab").toggleClass("is-hidden");
  $("#tab1, #tab2").toggleClass("is-active");
}

function populateFields() {
  loadJSON(function(response) {
    const properties = JSON.parse(response);

    properties.streets.forEach(street => {
      const owned = street.mortgage;
      const building = 0.5 * street.house_cost;
      const buildings = [
        owned + building,
        owned + 2*building,
        owned + 3*building,
        owned + 4*building,
        owned + 5*building
      ];

      $("#streets").append(`
        <div class="level flush">
          <div class="level-item"></div>
          <div class="level-item">
            <div class="${street.colour_set} property-name">
              ${street.name_la}
            </div>
          </div>
          <div class="level-item">
            <div class="select is-rounded">
              <select name="${street.code}" id="${street.code}">
                <option value="0">Sin comprar</option>
                <option value="${owned}">Comprada</option>
                <option value="${buildings[0]}">1 casa</option>
                <option value="${buildings[1]}">2 casas</option>
                <option value="${buildings[2]}">3 casas</option>
                <option value="${buildings[3]}">4 casas</option>
                <option value="${buildings[4]}">Hotel</option>
                <option value="0">Hipotecada</option>
              </select>
            </div>
          </div>
          <div class="level-item">
            <p class="input-container is-size-5 has-text-grey-light">
              <s style="text-decoration-style: double">M</s>&nbsp;<span id="${street.code}-value">0</span>
            </p>
          </div>
          <div class="level-item"></div>
        </div>`
      );
    });

    properties.railroads.forEach(railroad => {
      const owned = railroad.mortgage;

      $("#railroads").append(`
        <div class="level flush">
          <div class="level-item"></div>
          <div class="level-item">
            <div class="${railroad.colour_set} property-name">${railroad.name_la}</div>
          </div>
          <div class="level-item">
            <div class="select is-rounded">
              <select name="${railroad.code}" id="${railroad.code}">
                <option value="0">Sin comprar</option>
                <option value="${owned}">Comprado</option>
                <option value="0">Hipotecado</option>
              </select>
            </div>
          </div>
          <div class="level-item">
            <p class="input-container is-size-5 has-text-grey-light">
              <s style="text-decoration-style: double">M</s>&nbsp;<span id="${railroad.code}-value">0</span>
            </p>
          </div>
          <div class="level-item"></div>
        </div>`
      );
    });

    properties.utilities.forEach(utility => {
      const owned = utility.mortgage;

      $("#utilities").append(`
        <div class="level flush">
          <div class="level-item"></div>
          <div class="level-item">
            <div class="${utility.colour_set} property-name">${utility.name_la}</div>
          </div>
          <div class="level-item">
            <div class="select is-rounded">
              <select name="${utility.code}" id="${utility.code}">
                <option value="0">Sin comprar</option>
                <option value="${owned}">Comprada</option>
                <option value="0">Hipotecada</option>
              </select>
            </div>
          </div>
          <div class="level-item">
            <p class="input-container is-size-5 has-text-grey-light">
            <s style="text-decoration-style: double">M</s>&nbsp;<span id="${utility.code}-value">0</span>
          </p>
          </div>
          <div class="level-item"></div>
        </div>`
      );
    });
  });

  const bills = [
    {"denomination": "fiveHundred", "alt": "$500"},
    {"denomination": "oneHundred", "alt": "$100"},
    {"denomination": "fifty", "alt": "$50"},
    {"denomination": "twenty", "alt": "$20"},
    {"denomination": "ten", "alt": "$10"},
    {"denomination": "five", "alt": "$5"},
    {"denomination": "one", "alt": "$1"}
  ];

  bills.forEach(bill => {
    $("#cash").append(`
      <div class="level is-mobile">
        <div class="level-item"></div>
        <div class="level-item">
          <div class="bill">
            <figure class="image is-2by1"><img src="img/${bill.denomination}Bill.jpg" alt="${bill.alt}"></figure>
          </div>
        </div>
        <div class="level-item">
          <span class="is-size-3-desktop is-size-4-tablet is-size-4-mobile"> &times; </span>
        </div>
        <div class="level-item">
          <div class="input-container">
            <div class="control">
              <input class="input" type="number" name="${bill.denomination}s" id="${bill.denomination}s" value="0" min="0" step="1">
            </div>
          </div>
        </div>
        <div class="level-item">
          <span class="is-size-3-desktop is-size-4-tablet is-size-4-mobile"> = </span>
        </div>
        <div class="level-item">
          <p class="input-container is-size-5 has-text-grey-light">
            <s style="text-decoration-style: double">M</s>&nbsp;<span id="${bill.denomination}s-value">0</span>
          </p>
        </div>
        <div class="level-item"></div>
      </div>`
    );
  });
  
  $("#tens, #fiveHundreds").val(2).trigger("change");
  $("#oneHundreds").val(4).trigger("change");
  $("#fiftys, #twentys, #fives").val(1).trigger("change");
  $("#ones").val(5).trigger("change");
}

function loadJSON(callback) {
  var xobj = new XMLHttpRequest();
  
  xobj.overrideMimeType("application/json");
  xobj.open('GET', 'monopoly-properties.json', true);
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {
      callback(xobj.responseText);
    }
  };
  xobj.send(null);
}

function updateField(field) {
  const multiplier = calcMult(field);
  const inputField = `#${field}`;
  const valueField = `#${field}-value`;

  const newValue = $(inputField).val() * multiplier;
  
  if (newValue !== 0 || ($(inputField).find(":selected").text() !== "Sin comprar" && $(inputField).find(":selected").text() !== "")) {
    $(valueField).parent().addClass("has-text-weight-bold").removeClass("has-text-grey-light");
  } else {
    $(valueField).parent().removeClass("has-text-weight-bold").addClass("has-text-grey-light");
  }
  
  $(valueField).text(newValue);
}

function updateNetWorth() {
  var cashTotal = 0;
  var propertiesWorth = 0;

  $("select, input[type='number']").each(function(index) {
    let multiplier = calcMult(this.id);
    let val = $(this).val() * multiplier;

    if (isCash(this.id)) {
      cashTotal += val;
    } else {
      propertiesWorth += val;
    }
  });

  const netWorth = cashTotal + propertiesWorth;
  const netWorthStr = `<s style="text-decoration-style: double">M</s> ${netWorth}`;
  const cashStr = `<s style="text-decoration-style: double">M</s> ${cashTotal}`;
  const propertiesWorthStr = `<s style="text-decoration-style: double">M</s> ${propertiesWorth}`;

  $("#net-worth").html(netWorthStr);
  $("#total-cash").html(cashStr);
  $("#properties-worth").html(propertiesWorthStr);
}

function calcMult(field) {
  var multiplier = 1;

  switch (field) {
    case "fives":
      multiplier = 5;
      break;
    case "tens":
      multiplier = 10;
      break;
    case "twentys":
      multiplier = 20;
      break;
    case "fiftys":
      multiplier = 50;
      break;
    case "oneHundreds":
      multiplier = 100;
      break;
    case "fiveHundreds":
      multiplier = 500;
      break;
  }

  return multiplier;
}

function isCash(field) {
  const bills = ["ones", "fives", "tens", "twentys", "fiftys", "oneHundreds", "fiveHundreds"];
  if (bills.includes(field)) {
    return true;
  }
  return false;
}
