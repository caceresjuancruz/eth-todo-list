const JSON_CONTRACT_PATH = "../artifacts/contracts/Task.sol/TaskContract.json";
const rinkebyId = "0x4";
var TaskAddress = "0xa086D4C8e8Be8538Af615Ce286b2A803094816c4";
var contract;
var currentAccount;
var web3js = new Web3(Web3.givenProvider);

function metamaskReloadCallback()
{
  window.ethereum.on('accountsChanged', (accounts) => {
    document.getElementById("web3_message").textContent="Accounts changed, realoading...";
    window.location.reload()
  })
  window.ethereum.on('chainChanged', (accounts) => {
    document.getElementById("web3_message").textContent="Network changed, realoading...";
    window.location.reload()
  })
};

const getContract = async () => {
    const response = await fetch(JSON_CONTRACT_PATH);
    const data = await response.json();
    contract = new web3js.eth.Contract(data.abi, TaskAddress);
    return contract
};

const connectWallet = async () => {
    if (window.ethereum) {
        let chainId = await window.ethereum.request({method: "eth_chainId"});
        console.log("connected to chain: " + chainId);
        if(chainId !== rinkebyId){
            alert("You are not connected to the Rinkeby Testnet!");
        } else {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            window.web3 = new Web3(window.ethereum);
            const account = web3.eth.accounts;
            //Get the current MetaMask selected/active wallet
            const walletAddress = account.givenProvider.selectedAddress;
            currentAccount = walletAddress;
            console.log(`Successfully connected! - Wallet: ${walletAddress}`);
            document.getElementById("connectWalletBtn").textContent = "Connected wallet: " + walletAddress;
            getTasks();
        }
    } else {
        console.log("No wallet");
        document.getElementById("connectWalletBtn").textContent = "No wallet installed :(";
    }
};

const getTasks = async () => {
    await contract.methods.getTasks().call({from: currentAccount})
    .then(function(result){
        parsed = "";
        for (i = 0; i < result.length; i++) {
            var task = result[i];
            if(task[2] == false)
              parsed += "<div class='rounded m-2 px-2 fs-4 text-light bg-light bg-gradient bg-opacity-10'>" + 
              task[1] + 
              " <button class='btn btn-light btn-sm border-0 p-0 mt-2 px-2 rounded-pill fw-bold text-light bg-transparent' id='removeTaskBtn' onclick='deleteTask("+task[0]+")'>  X  </button></div>";
        }
        $("#myTasks").empty();                           
        $("#myTasks").append(parsed);
    });    
};

const addTask = async (_taskText) => {
  
  web3js.eth.sendTransaction({
    from: currentAccount,
    to: TaskAddress,
    data: contract.methods.addTask(_taskText).encodeABI()
  })
  .on('transactionHash', function(hash){
    document.getElementById("web3_message").textContent="Adding task...";
  })
  .on('receipt', function(receipt){
    document.getElementById("web3_message").textContent="Success! task added.";
    setTimeout(function(){ document.getElementById("web3_message").textContent="";}, 2000);
    getTasks(); })
  .catch((revertReason) => {
    console.log("ERROR! Transaction reverted: " + revertReason)
  });
}; 

const deleteTask = async (_taskId) => {
  
  web3js.eth.sendTransaction({
    from: currentAccount,
    to: TaskAddress,
    data: contract.methods.deleteTask(_taskId).encodeABI()
  })
  .on('transactionHash', function(hash){
    document.getElementById("web3_message").textContent="Deleting task...";
  })
  .on('receipt', function(receipt){
    document.getElementById("web3_message").textContent="Success! task deleted.";
    setTimeout(function(){ document.getElementById("web3_message").textContent="";}, 2000);
    getTasks(); })
  .catch((revertReason) => {
    console.log("ERROR! Transaction reverted: " + revertReason)
  });
};

function startDapp() {
  
  metamaskReloadCallback()
  getContract()
  $(document).on("submit", "form.task", function(e){
      e.preventDefault();
      var val = $("#taskText").val();
      addTask(val);
      setTimeout(function(){ document.getElementById('taskText').value = "";}, 500);
    })
    
    
};

startDapp();


