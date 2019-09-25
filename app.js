// Model Controller

var BudgetController = (function() {
  var newElement;
  var Expense = function(id, desc, val,prcent) {
    this.id = id;
    this.desc = desc;
    this.val = val;
    this.prcent = prcent;
  };
  var Income = function(id, desc, val) {
    this.id = id;
    this.desc = desc;
    this.val = val;
  };
  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
  };

  return {
    addItem: function(type, desc, val) {
      if (type === "" || desc === "" || val === ""){
        alert("You Must Fill the Inputs");
      }else {
      var ID,PRCENT = "";
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }
      
      if (type === "inc") {
        newElement = new Income(ID, desc, val);
        data.totals.inc += Number(val);
      } else if (type === "exp") {
        newElement = new Expense(ID, desc, val,PRCENT);
        data.totals.exp += Number(val);
      }
      data.allItems[type].push(newElement);
      return newElement;
    }},
    updateMonth: function() {
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];

      const MonthNumber = new Date().getMonth();
      return monthNames[MonthNumber];
    },
    updateBudget : function (){
      var sign,prcent;
      if (data.totals.inc > data.totals.exp){
        sign = "+";
      }else if (data.totals.inc < data.totals.exp) {
        sign = "-";
      } else { 
        sign = "";
      }
      if (data.totals.inc === 0){
        prcent = 0;
      }else {
        prcent = ((data.totals.exp / data.totals.inc) * 100).toFixed(0)
      }
      return {
        data : data.totals,
        SignVal : sign,
        prcrenVal : prcent
      };
    }, 
    updateExpPrcent : function (list){
      const values = Object.values(data.allItems.exp);
      var j = 0;
      for (var value of values) {
        value.prcent = ((value.val/data.totals.exp)*100).toFixed(0) + " %";
          list[j].textContent = value.prcent;
        j++;
      }

    },
    deleteElement : function (event){
    
      var elementClass, itemIDArray,itemType,itemId,ParentClass;
      ParentClass = event.target.parentNode.parentNode.parentNode.parentNode;
      elementClass = ParentClass.id;

if (elementClass){
 itemIDArray = elementClass.split('-');
 itemType = itemIDArray[0];
 itemId = itemIDArray[1];
 if (itemType === "inc"){
  data.totals.inc -= data.allItems.inc[itemId].val
 }else if (itemType === "exp"){
  data.totals.exp -= data.allItems.exp[itemId].val
 }
 ParentClass.remove();
 viewController.updateBudgetUi(BudgetController.updateBudget().data,BudgetController.updateBudget().SignVal,BudgetController.updateBudget().prcrenVal);

}
    }
  };
})();



// View Controller

var viewController = (function() {
  var DOMstrings = {
    addBtn: ".add__btn",
    descriptionInput: ".add__description",
    typeInput: ".add__type",
    valueInput: ".add__value",
    expenDiv: ".expenses__list",
    incomeDiv: ".income__list",
    Monthspan: ".budget__title--month",
    IncomeSpan: ".budget__income--value",
    ExpenseSpan: ".budget__expenses--value",
    BudgetDiffDiv: ".budget__value",
    Prcentspan : ".budget__expenses--percentage",
    elemprcent : ".item__percentage",
    expensListDiv : ".expenses__list",
    incomeListDiv : ".income__list",
    maindiv : ".container"

  };

  return {
    getDOMstrings: function() {
      return DOMstrings;
    },
    getDOMvalues: function() {
      return {
        description: document.querySelector(DOMstrings.descriptionInput).value,
        type: document.querySelector(DOMstrings.typeInput).value,
        value: Math.abs(document.querySelector(DOMstrings.valueInput).value)
      };
    },
    AddToUI: function(type, obj) {
      if (obj){
      var html, newHTML, element;
      if (type === "inc") {
        element = DOMstrings.incomeDiv;
        html =
          '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === "exp") {
        element = DOMstrings.expenDiv;
        html =
          ' <div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage"></div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      newHTML = html.replace("%id%", obj.id);
      newHTML = newHTML.replace("%description%", obj.desc);
      newHTML = newHTML.replace("%value%", obj.val);
      document.querySelector(element).insertAdjacentHTML("beforeend", newHTML);
    }},
    clearInputs: function() {
      var fields = document.querySelectorAll(
        DOMstrings.descriptionInput + "," + DOMstrings.valueInput
      );
      var ArrFields = Array.prototype.slice.call(fields);
      fieldsArr = Array.prototype.slice.call(fields);
      ArrFields.forEach(element => {
        element.value = "";
      });
      ArrFields[0].focus();
    },
    updateMonthUI: function(dateM) {
      var dateDiv,getMonthUI;
      getMonthUI = dateM
      dateDiv = document.querySelector(DOMstrings.Monthspan);
      dateDiv.textContent = getMonthUI;
    },
    updateBudgetUi: function (budValues,DiffSign,prcrentage){
      var incDiv, expDiv,BudDiff,PrcentDiv,elemprcentDiv;

      // Getting The elements : 
      incDiv = document.querySelector(DOMstrings.IncomeSpan);
      expDiv = document.querySelector(DOMstrings.ExpenseSpan);
      BudDiff = document.querySelector(DOMstrings.BudgetDiffDiv);
      PrcentDiv = document.querySelector(DOMstrings.Prcentspan);
      // Editting UI : 
      PrcentDiv.textContent = prcrentage + "%";
      incDiv.textContent = " + " + budValues.inc;
      expDiv.textContent = " - " + budValues.exp; 
      BudDiff.textContent =  DiffSign + " " + (Math.abs(budValues.inc - budValues.exp));

    },
    getExpensesPrcent: function (){
      elemprcentDiv = document.querySelectorAll(DOMstrings.elemprcent)
      return (elemprcentDiv)
    },
  };
})();

// Global  Controller

var globalController = (function(viewCtrl, modelCtrl) {
  var CtrlDOMvalues, CtrlAddedElement;
  var DOM = viewCtrl.getDOMstrings();
  var setupListners = function() {
    document.querySelector(DOM.addBtn).addEventListener("click", addItemCtrl);
    document.addEventListener("keypress", function(e) {
      if (e.keyCode === 13 || e.which === 13) {
        addItemCtrl();
      }
    });
    document.querySelector(DOM.maindiv).addEventListener("click",modelCtrl.deleteElement);
  };

  var addItemCtrl = function() {
    // Get the values from UI.
    CtrlDOMvalues = viewCtrl.getDOMvalues();

    // Add the values to Budget Controller
    CtrlAddedElement = modelCtrl.addItem(
      CtrlDOMvalues.type,
      CtrlDOMvalues.description,
      CtrlDOMvalues.value
    );
    // Add to the UI :
    viewCtrl.AddToUI(CtrlDOMvalues.type, CtrlAddedElement);
    // Clear the inputs :
    viewCtrl.clearInputs();

    // update the Budget UI : 

     viewCtrl.updateBudgetUi(BudgetController.updateBudget().data,BudgetController.updateBudget().SignVal,BudgetController.updateBudget().prcrenVal);

      // update the prcentage of each element : 

     modelCtrl.updateExpPrcent(viewCtrl.getExpensesPrcent())

        
  
  };

  return {
    init: function() {
      setupListners();
      viewCtrl.updateMonthUI(modelCtrl.updateMonth());
    },
    }


})(viewController, BudgetController);

globalController.init();
