
//Your IPFS api key in ifura.io
const projectId = "11293c6b6b424c29884e03f63562d2ab";
//Your api secret in ifura.io
const projectSecret = "4xIw6ZTNntoBEV2XIoeQ7wIYJtWl+7s/oP+WLNzk//Wxg6Nh9pY+NQ";
window.CONTRACT = {
  address: "0x426838e0F2A4CDB0d56a811ee4e82300D33b0ccA",
  network: "https://sepolia.infura.io/v3/11293c6b6b424c29884e03f63562d2ab",
  explore: "https://sepolia.etherscan.io",
  // Your Contract ABI
  abi: [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_add",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "_info",
				"type": "string"
			}
		],
		"name": "add_Exporter",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "hash",
				"type": "bytes32"
			},
			{
				"internalType": "string",
				"name": "_ipfs",
				"type": "string"
			}
		],
		"name": "addDocHash",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_add",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "_newInfo",
				"type": "string"
			}
		],
		"name": "alter_Exporter",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "_exporter",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "_ipfsHash",
				"type": "string"
			}
		],
		"name": "addHash",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_newOwner",
				"type": "address"
			}
		],
		"name": "changeOwner",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_add",
				"type": "address"
			}
		],
		"name": "delete_Exporter",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_hash",
				"type": "bytes32"
			}
		],
		"name": "deleteHash",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "count_Exporters",
		"outputs": [
			{
				"internalType": "uint16",
				"name": "",
				"type": "uint16"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "count_hashes",
		"outputs": [
			{
				"internalType": "uint16",
				"name": "",
				"type": "uint16"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_hash",
				"type": "bytes32"
			}
		],
		"name": "findDocHash",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_add",
				"type": "address"
			}
		],
		"name": "getExporterInfo",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
};
//login
async function connect() {
  if (window.ethereum) {
    try {
      const selectedAccount = await window.ethereum
        .request({
          method: "eth_requestAccounts",
        })
        .then((accounts) => {
          return accounts[0];
        })
        .catch(() => {
          throw Error("No account selected 👍");
        });

      window.userAddress = selectedAccount;
      console.log(selectedAccount);
      window.localStorage.setItem("userAddress", window.userAddress);
      window.location.reload();
    } catch (error) { }
  } else {
    $("#upload_file_button").attr("disabled", true);
    $("#doc-file").attr("disabled", true);
    // Show The Warning for not detecting wallet
    document.querySelector(".alert").classList.remove("d-none");
  }
}

window.onload = async () => {
  if (window.location.href.indexOf("verify.html") > -1) {
    $("#loader").hide();
    $(".loader-wraper").fadeOut("slow");

    //check the Url if it was Passed with document hash
    $("#upload_file_button").attr("disabled", true);
    checkURL();
  }

  $("#loginButton").hide();
  $("#recent-header").hide();
  $(".loader-wraper").fadeOut("slow");
  hide_txInfo();
  $("#upload_file_button").attr("disabled", true);

  window.userAddress = window.localStorage.getItem("userAddress");
  console.log("Stored user address:", window.userAddress);

  if (window.ethereum) {
    console.log("MetaMask detected");
    //gere we need MetaMask to read and write to our Contract
    window.web3 = new Web3(window.ethereum);
    window.contract = new window.web3.eth.Contract(
      window.CONTRACT.abi,
      window.CONTRACT.address
    );
    console.log("Web3 and contract initialized");
    console.log("Contract address:", window.CONTRACT.address);
    console.log("Network URL:", window.CONTRACT.network);

    // Validate contract
    try {
      const code = await window.web3.eth.getCode(window.CONTRACT.address);
      if (code === '0x') {
        console.error("❌ No contract deployed at this address!");
        alert("⚠️ Contract not found at address: " + window.CONTRACT.address + "\n\nPlease check:\n1. Contract is deployed\n2. Address is correct\n3. You're on the right network");
      } else {
        console.log("✅ Contract found at address");
      }
    } catch (error) {
      console.error("Error checking contract:", error);
    }

    //checking if user loged in
    if (window.userAddress && window.userAddress.length > 10) {
      console.log("User is logged in, setting up UI...");
      // let isLocked =await window.ethereum._metamask.isUnlocked();
      //  if(!isLocked) disconnect();
      $("#logoutButton").show();
      $("#loginButton").hide();
      $("#userAddress")
        .html(`<i class="fa-solid fa-address-card mx-2 text-primary"></i>${truncateAddress(
          window.userAddress
        )}
       <a class="text-info" href="${window.CONTRACT.explore}/address/${window.userAddress
          }" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-square-arrow-up-right text-warning"></i></a>  
       </a>`);

      //if admin is viewed then show the doc,exporter counters
      if (window.location.href.indexOf("admin.html") > -1) {
        console.log("Admin page detected, loading counters...");
        await getCounters();
      }

      console.log("Getting exporter info...");
      await getExporterInfo();
      console.log("Getting chain ID...");
      await get_ChainID();
      console.log("Getting ETH balance...");
      await get_ethBalance();
      $("#Exporter-info").html(
        `<i class="fa-solid fa-building-columns mx-2 text-warning"></i>${window.info}`
      );

      setTimeout(() => {
        listen();
      }, 0);
    } else {
      $("#logoutButton").hide();
      $("#loginButton").show();
      $("#upload_file_button").attr("disabled", true);
      $("#doc-file").attr("disabled", true);
      $(".box").addClass("d-none");
      $(".loading-tx").addClass("d-none");
    }
  } else {
    //No metamask detected
    $("#logoutButton").hide();
    $("#loginButton").hide();
    $(".box").addClass("d-none");
    $("#upload_file_button").attr("disabled", true);
    $("#doc-file").attr("disabled", true);
    document.querySelector(".alert").classList.remove("d-none");

    // alert("Please download metamask extension first.\nhttps://metamask.io/download/");
    // window.location = "https://metamask.io/download/"
  }
};

async function verify_Hash() {
  //Show the loading
  $("#loader").show();

  if (window.hashedfile) {
    /*   I used the contract address (window.CONTRACT.address) as the caller of the function 'findDocHash'
        you can use any address because it used just for reading info from the contract
    */
    await contract.methods
      .findDocHash(window.hashedfile)
      .call({ from: window.userAddress })
      .then((result) => {
        $(".transaction-status").removeClass("d-none");
        window.newHash = result;
        if ((result[0] != 0) & (result[1] != 0)) {
          //Doc Verified
          print_verification_info(result, true);
        } else {
          //Doc not Verified
          print_verification_info(result, false);
        }
      });
  }
}

function checkURL() {
  let url_string = window.location.href;
  let url = new URL(url_string);
  window.hashedfile = url.searchParams.get("hash");
  if (!window.hashedfile) return;

  verify_Hash();
}
// get Sha3 Hash from the file


function print_verification_info(result, is_verified) {
  //Default Image for not Verified Docunets
  document.getElementById("student-document").src = "./files/notvalid.svg";
  $("#loader").hide();
  // Show preview box
  $("#preview-box").removeClass("d-none");
  // when document not verfied
  if (!is_verified) {
    // document.getElementById('download-document').classList.add('d-none')
    $("#download-document").hide();
    $("#doc-status").html(`<h3 class="text-danger">
        Certificate not Verified 😕
         <i class="text-danger  fa fa-times-circle" aria-hidden="true"></i>
        </h3>`);
    $("#file-hash").html(
      `<span class="text-info"><i class="fa-solid fa-hashtag"></i></span> ${truncateAddress(
        window.hashedfile
      )}`
    );
    $("#college-name").hide();
    $("#contract-address").hide();
    $("#time-stamps").hide();
    $("#blockNumber").hide();
    $(".transaction-status").show();
  } else {
    $("#download-document").show();
    // when document verfied
    $("#college-name").show();
    $("#contract-address").show();
    $("#time-stamps").show();
    $("#blockNumber").show();

    var t = new Date(1970, 0, 1);
    t.setSeconds(result[1]);
    console.log(result[1]);
    t.setHours(t.getHours() + 3);
    // hide loader
    $("#loader").hide();
    $("#doc-status").html(`<h3 class="text-info">
         Certificate Verified Successfully 😊
         <i class="text-info fa fa-check-circle" aria-hidden="true"></i>
        </h3>`);
    $("#file-hash").html(
      `<span class="text-info"><i class="fa-solid fa-hashtag"></i></span> ${truncateAddress(
        window.hashedfile
      )}`
    );
    $("#college-name").html(
      `<span class="text-info"><i class="fa-solid fa-graduation-cap"></i></span> ${result[2]}`
    );
    $("#contract-address").html(
      `<span class="text-info"><i class="fa-solid fa-file-contract"></i> </span>${truncateAddress(
        window.CONTRACT.address
      )}`
    );
    $("#time-stamps").html(
      `<span class="text-info"><i class="fa-solid fa-clock"></i> </span>${t}`
    );
    $("#blockNumber").html(
      `<span class="text-info"><i class="fa-solid fa-cube"></i></span> ${result[0]}`
    );
    const studentDoc = document.getElementById("student-document");
    studentDoc.src = `https://ipfs.io/ipfs/${result[3]}`;
    // Add error handler for IPFS load failure
    studentDoc.onerror = function() {
      this.onerror = null; // Prevent infinite loop
      this.src = './files/approved.png';
    };
    document.getElementById("download-document").href = studentDoc.src;
    $(".transaction-status").show();
  }
}

function hide_txInfo() {
  $(".transaction-status").addClass("d-none");
}

function show_txInfo() {
  $(".transaction-status").removeClass("d-none");
}
async function get_ethBalance() {
  try {
    await web3.eth.getBalance(window.userAddress, function (err, balance) {
      if (err === null) {
        $("#userBalance").html(
          "Balance: <i class='fa-brands fa-gg-circle mx-2 text-danger'></i>" +
          web3.utils.fromWei(balance).substr(0, 6) +
          " ETH"
        );
      } else {
        console.error("Balance error:", err);
        $("#userBalance").html("Balance: <span class='text-warning'>n/a</span>");
      }
    });
  } catch (error) {
    console.error("get_ethBalance error:", error);
    $("#userBalance").html("Balance: <span class='text-warning'>n/a</span>");
  }
}

if (window.ethereum) {
  window.ethereum.on("accountsChanged", function (accounts) {
    connect();
  });
}

function printUploadInfo(result) {
  $("#transaction-hash").html(
    `<a target="_blank" title="View Transaction at Polygon Scan" href="${window.CONTRACT.explore}/tx/` +
    result.transactionHash +
    '"+><i class="fa fa-check-circle font-size-2 mx-1 text-white mx-1"></i></a>' +
    truncateAddress(result.transactionHash)
  );
  $("#file-hash").html(
    `<i class="fa-solid fa-hashtag mx-1"></i> ${truncateAddress(
      window.hashedfile
    )}`
  );
  $("#contract-address").html(
    `<i class="fa-solid fa-file-contract mx-1"></i> ${truncateAddress(
      result.transactionHash
    )}`
  );
  $("#time-stamps").html('<i class="fa-solid fa-clock mx-1"></i>' + getTime());
  $("#blockNumber").html(
    `<i class="fa-solid fa-link mx-1"></i>${result.blockNumber}`
  );
  $("#blockHash").html(
    `<i class="fa-solid fa-shield mx-1"></i> ${truncateAddress(
      result.blockHash
    )}`
  );
  $("#to-netowrk").html(
    `<i class="fa-solid fa-chart-network"></i> ${window.chainID}`
  );
  $("#to-netowrk").hide();
  $("#gas-used").html(
    `<i class="fa-solid fa-gas-pump mx-1"></i> ${result.gasUsed} Gwei`
  );
  $("#loader").addClass("d-none");
  $("#upload_file_button").addClass("d-block");
  show_txInfo();
  get_ethBalance();

  $("#note").html(`<h5 class="text-info">
   Transaction Confirmed to the BlockChain 😊<i class="mx-2 text-info fa fa-check-circle" aria-hidden="true"></i>
   </h5>`);
  listen();
}

async function getFilebinInfo(filebinUrl, filebinId) {
  try {
    const response = await fetch(
      `https://api.pdfrest.com/resource/${window.hashedfile}?format=url`,
      {
        method: "GET",
        headers: {},
      }
    );

    if (!response.ok) {
      throw new Error(
        "Failed to retrieve file information:",
        await response.text()
      );
    }

    const data = await response.json();
    console.log(data); // This should contain information about the uploaded file
    return data;
  } catch (error) {
    console.error("Error fetching file information:", error);
    throw error; // Re-throw for potential handling in calling code
  }
}

async function uploadFileToIpfs() {

  const formData = new FormData();
  formData.append("file", file);
  uploadIPFS();
  //for authinticating your request to infura.io
  const auth = "Basic " + btoa(`${projectId}:${projectSecret}`);

  try {
    //make post request to upload the file and get the CID
    const response = await fetch("https://ipfs.infura.io:5001/api/v0/add", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: auth,
      },
    });

    if (!response.ok) {
      throw new Error("File upload failed");
    }

    const data = await response.json();
    console.log(data["Hash"]); // Response data
    //return the CID to the addDocHash to store it in the Contract
    return data["Hash"];
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}
async function sendHash() {
  $("#loader").removeClass("d-none");
  $("#upload_file_button").slideUp();
  $("#note").html(
    `<h5 class="text-info">Please confirm the transaction 🙂</h5>`
  );
  $("#upload_file_button").attr("disabled", true);
  get_ChainID();
  // Initilize Ipfs
  // https://api.pdfrest.com/resource/21c2cbf2d-eb79-4eef-be3e-303b98d26f8c?format=url
  // https://api.pdfrest.com/resource/2ff49040b-a696-44ce-a705-1c1ca69d51c8?format=url
  // =================================================
  // await getFilebinInfo();
  // await uploadFileToBin();
  await createSpace();
  const cid = await uploadIPFS();
  const link = `https://${cid}.ipfs.storacha.link`;
  $("#ipfs-link").html(`
    <h5 class="text-info p-1 text-center">✅ Uploaded! CID: <b>${cid}</b><br><a href="${link}" target="_blank">View on IPFS</a></h5>`);
  if (window.hashedfile.length > 4) {
    await window.contract.methods
      .addDocHash(window.hashedfile, cid)
      .send({
        from: window.userAddress,
        gas: 16700000
      })
      .on("transactionHash", function (_hash) {
        $("#note").html(
          `<h5 class="text-info p-1 text-center">Please wait for transaction to be mined...</h5>`
        );
      })

      .on("receipt", function (receipt) {
        printUploadInfo(receipt);
        generateQRCode();
      })

      .on("confirmation", function (confirmationNr) { })
      .on("error", function (error) {
        console.log(error.message);
        $("#note").html(`<h5 class="text-center">${error.message} 😏</h5>`);
        $("#loader").addClass("d-none");
        $("#upload_file_button").slideDown();
      });
  }
}

//delete document hash from the contract
//only the exporter who add it can delete it
async function deleteHash() {
  $("#loader").removeClass("d-none");
  $("#upload_file_button").slideUp();
  $("#note").html(
    `<h5 class="text-info">Please confirm the transaction 🙂</h5>`
  );
  $("#upload_file_button").attr("disabled", true);
  get_ChainID();

  if (window.hashedfile) {
    await window.contract.methods
      .deleteHash(window.hashedfile)
      .send({ from: window.userAddress })
      .on("transactionHash", function (hash) {
        $("#note").html(
          `<h5 class="text-info p-1 text-center">Please wait for transaction to be mined 😴</h5>`
        );
      })

      .on("receipt", function (receipt) {
        $("#note").html(
          `<h5 class="text-info p-1 text-center">Document Deleted 😳</h5>`
        );

        $("#loader").addClass("d-none");
        $("#upload_file_button").slideDown();
      })

      .on("confirmation", function (confirmationNr) {
        console.log(confirmationNr);
      })
      .on("error", function (error) {
        console.log(error.message);
        $("#note").html(`<h5 class="text-center">${error.message}</h5>`);
        $("#loader").addClass("d-none");
        $("#upload_file_button").slideDown();
      });
  }
}

//get current time
function getTime() {
  let d = new Date();
  a =
    d.getFullYear() +
    "-" +
    (d.getMonth() + 1) +
    "-" +
    d.getDate() +
    " - " +
    d.getHours() +
    ":" +
    d.getMinutes() +
    ":" +
    d.getSeconds();
  return a;
}

//get network name based on ID
async function get_ChainID() {
  try {
    let a = await web3.eth.getChainId();
    console.log("Chain ID:", a);
    switch (a) {
      case 1:
        window.chainID = "Ethereum Main Network (Mainnet)";
        break;
      case 11155111:
        window.chainID = "Sepolia Test Network";
        break;
      case 80001:
        window.chainID = "Polygon Test Network";
        break;
      case 137:
        window.chainID = "Polygon Mainnet";
        break;
      case 3:
        window.chainID = "Ropsten Test Network";
        break;
      case 4:
        window.chainID = "Rinkeby Test Network";
        break;
      case 5:
        window.chainID = "Goerli Test Network";
        break;
      case 42:
        window.chainID = "Kovan Test Network";
        break;
      default:
        window.chainID = "Unknown ChainID: " + a;
        break;
    }
    let network = document.getElementById("network");
    if (network) {
      document.getElementById(
        "network"
      ).innerHTML = `Network: <i class="text-info fa-solid fa-circle-nodes mx-2"></i>${window.chainID}`;
    }
  } catch (error) {
    console.error("get_ChainID error:", error);
    let network = document.getElementById("network");
    if (network) {
      network.innerHTML = `Network: <span class="text-warning">Error getting network</span>`;
    }
  }
}

function get_Sha3() {
  hide_txInfo();
  $("#note").html(`<h5 class="text-warning">Hashing Your Document 😴...</h5>`);

  $("#upload_file_button").attr("disabled", false);

  console.log("file changed");

  var file = document.getElementById("doc-file").files[0];
  if (file) {
    var reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = function (evt) {
      // var SHA256 = new Hashes.SHA256();
      // = SHA256.hex(evt.target.result);
      window.hashedfile = web3.utils.soliditySha3(evt.target.result);
      console.log(`Document Hash : ${window.hashedfile}`);
      $("#note").html(
        `<h5 class="text-center text-info">Document Hashed  😎 </h5>`
      );
    };
    reader.onerror = function (evt) {
      console.log("error reading file");
    };
  } else {
    window.hashedfile = null;
  }
}

//logout
function disconnect() {
  $("#logoutButton").hide();
  $("#loginButton").show();
  window.userAddress = null;
  $(".wallet-status").addClass("d-none");
  window.localStorage.setItem("userAddress", null);
  $("#upload_file_button").addClass("disabled");
}

//shortcut wallet address
function truncateAddress(address) {
  if (!address) {
    return;
  }
  return `${address.substr(0, 7)}...${address.substr(
    address.length - 8,
    address.length
  )}`;
}

async function addExporter() {
 const addressElement = document.querySelector('#userAddress a');
const href = addressElement?.getAttribute('href');

let fullAddress = null;
if (href) {
  const match = href.match(/address\/(0x[a-fA-F0-9]{40})/);
  if (match) {
    fullAddress = match[1];
  }
}
 let address= fullAddress;
 console.log("address is:- ");
 console.log(address);
  const info = "Abhishek";

  // Address validation
  if (!address || !info) {
    $("#note").html(
      `<h5 class="text-center text-warning">Please provide both address & information</h5>`
    );
    return;
  }

  // Check if valid Ethereum address
  if (!web3.utils.isAddress(address)) {
    $("#note").html(
      `<h5 class="text-center text-danger">Invalid Ethereum address format!</h5>`
    );
    return;
  }

  // Check if trying to add own address

  console.log("Adding exporter:", address, "Info:", info);

  $("#loader").removeClass("d-none");
  $("#ExporterBtn").slideUp();
  $("#edit").slideUp();
  $("#delete").slideUp();
  $("#note").html(
    `<h5 class="text-info">Please confirm the transaction 👍...</h5>`
  );
  $("#ExporterBtn").attr("disabled", true);
  $("#delete").attr("disabled", true);
  $("#edit").attr("disabled", true);
  get_ChainID();

  try {
    await window.contract.methods
      .add_Exporter(window.userAddress, info)
      .send({ from: window.userAddress })

      .on("transactionHash", function (hash) {
        $("#note").html(
          `<h5 class="text-info p-1 text-center">Please wait for transaction to be mined 😴...</h5>`
        );
        console.log("Transaction hash:", hash);
      })

      .on("receipt", function (receipt) {
        $("#loader").addClass("d-none");
        $("#ExporterBtn").slideDown();
        $("#edit").slideDown();
        $("#delete").slideDown();
        console.log("Transaction receipt:", receipt);
        $("#note").html(
          `<h5 class="text-success">✅ Exporter Added to the Blockchain Successfully! 😇</h5>`
        );
        // Clear form
        document.getElementById("Exporter-address").value = "";
        document.getElementById("info").value = "";
        // Refresh counters
        getCounters();
      })

      .on("confirmation", function (confirmationNr) {
        console.log("Confirmation:", confirmationNr);
      })
      .on("error", function (error) {
        console.error("Transaction error:", error);
        $("#note").html(`<h5 class="text-center text-danger">❌ ${error.message}</h5>`);
        $("#loader").addClass("d-none");
        $("#ExporterBtn").slideDown();
        $("#edit").slideDown();
        $("#delete").slideDown();
        $("#ExporterBtn").attr("disabled", false);
        $("#delete").attr("disabled", false);
        $("#edit").attr("disabled", false);
      });
  } catch (error) {
    console.error("Add exporter error:", error);
    $("#note").html(`<h5 class="text-center text-danger">❌ ${error.message}</h5>`);
    $("#loader").addClass("d-none");
    $("#ExporterBtn").slideDown();
    $("#edit").slideDown();
    $("#delete").slideDown();
    $("#ExporterBtn").attr("disabled", false);
    $("#delete").attr("disabled", false);
    $("#edit").attr("disabled", false);
  }
}

async function getExporterInfo() {
  await window.contract.methods
    .getExporterInfo(window.userAddress)
    .call({ from: window.userAddress })

    .then((result) => {
      window.info = result;
    });
}

async function getCounters() {
  try {
    console.log("Getting counters from contract:", window.CONTRACT.address);

    // Test if contract is accessible first
    const exporterCount = await window.contract.methods
      .count_Exporters()
      .call({ from: window.userAddress });

    $("#num-exporters").html(
      `Exporters: <i class="fa-solid fa-building-columns mx-2 text-info"></i>${exporterCount}`
    );

    const hashCount = await window.contract.methods
      .count_hashes()
      .call({ from: window.userAddress });

    $("#num-hashes").html(
      `Documents: <i class="fa-solid fa-file mx-2 text-warning"></i>${hashCount}`
    );

    console.log("Counters loaded successfully - Exporters:", exporterCount, "Hashes:", hashCount);

  } catch (error) {
    console.error("Error getting counters:", error);
    $("#num-exporters").html(
      `Exporters: <span class="text-danger">Error loading</span>`
    );
    $("#num-hashes").html(
      `Documents: <span class="text-danger">Error loading</span>`
    );

    // Check if it's a contract issue
    if (error.message.includes("Returned values aren't valid")) {
      $("#note").html(
        `<h5 class="text-danger">⚠️ Contract connection issue. Please check:</h5>
         <ul class="text-left">
           <li>Contract address is correct</li>
           <li>Contract is deployed on Sepolia</li>
           <li>You're connected to Sepolia network</li>
         </ul>`
      );
    }
  }
}

async function editExporter() {
  const address = document.getElementById("Exporter-address").value;
  const info = document.getElementById("info").value;

  if (info && address) {
    $("#loader").removeClass("d-none");
    $("#ExporterBtn").slideUp();
    $("#edit").slideUp();
    $("#delete").slideUp();
    $("#note").html(
      `<h5 class="text-info">Please confirm the transaction 😴...</h5>`
    );
    $("#ExporterBtn").attr("disabled", true);
    get_ChainID();

    try {
      await window.contract.methods
        .alter_Exporter(address, info)
        .send({ from: window.userAddress })

        .on("transactionHash", function (hash) {
          $("#note").html(
            `<h5 class="text-info p-1 text-center">Please wait for transaction to be mined 😇...</h5>`
          );
        })

        .on("receipt", function (receipt) {
          $("#loader").addClass("d-none");
          $("#ExporterBtn").slideDown();
          console.log(receipt);
          $("#note").html(
            `<h5 class="text-info">Exporter Updated Successfully 😊</h5>`
          );
        })

        .on("confirmation", function (confirmationNr) { })
        .on("error", function (error) {
          console.log(error.message);
          $("#note").html(`<h5 class="text-center">${error.message} 👍</h5>`);
          $("#loader").addClass("d-none");
          $("#ExporterBtn").slideDown();
        });
    } catch (error) {
      $("#note").html(`<h5 class="text-center">${error.message} 👍</h5>`);
      $("#loader").addClass("d-none");
      $("#ExporterBtn").slideDown();
      $("#edit").slideDown();
      $("#delete").slideDown();
    }
  } else {
    $("#note").html(
      `<h5 class="text-center text-warning">You need to provide address & inforamtion to update 😵‍💫 </h5>`
    );
  }
}

async function deleteExporter() {
  const address = document.getElementById("Exporter-address").value;

  if (address) {
    $("#loader").removeClass("d-none");
    $("#ExporterBtn").slideUp();
    $("#edit").slideUp();
    $("#delete").slideUp();
    $("#note").html(
      `<h5 class="text-info">Please confirm the transaction 😕...</h5>`
    );
    $("#ExporterBtn").attr("disabled", true);
    get_ChainID();

    try {
      await window.contract.methods
        .delete_Exporter(address)
        .send({ from: window.userAddress })

        .on("transactionHash", function (hash) {
          $("#note").html(
            `<h5 class="text-info p-1 text-center">Please wait for transaction to be mined 😴 ...</h5>`
          );
        })

        .on("receipt", function (receipt) {
          $("#loader").addClass("d-none");
          $("#ExporterBtn").slideDown();
          $("#edit").slideDown();
          $("#delete").slideDown();
          console.log(receipt);
          $("#note").html(
            `<h5 class="text-info">Exporter Deleted Successfully 🙂</h5>`
          );
        })
        .on("error", function (error) {
          console.log(error.message);
          $("#note").html(`<h5 class="text-center">${error.message} 🙂</h5>`);
          $("#loader").addClass("d-none");
          $("#ExporterBtn").slideDown();
          $("#edit").slideDown();
          $("#delete").slideDown();
        });
    } catch (error) {
      $("#note").html(`<h5 class="text-center">${error.message} 🙂</h5>`);
      $("#loader").addClass("d-none");
      $("#ExporterBtn").slideDown();
      $("#edit").slideDown();
      $("#delete").slideDown();
    }
  } else {
    $("#note").html(
      `<h5 class="text-center text-warning">You need to provide address to delete 👍</h5>`
    );
  }
}

// Generate QR code so any one an Verify the documents
//note: if you r using local server you need to replace 127.0.0.1 with your machine local ip address got from the router
function generateQRCode() {
  document.getElementById("qrcode").innerHTML = "";
  console.log("making qr-code...");
  var qrcode = new QRCode(document.getElementById("qrcode"), {
    colorDark: "#000",
    colorLight: "#fff",
    correctLevel: QRCode.CorrectLevel.H,
  });
  if (!window.hashedfile) return;
  let url = `${window.location.host}/verify.html?hash=${window.hashedfile}`;
  qrcode.makeCode(url);
  document.getElementById("download-link").download =
    document.getElementById("doc-file").files[0].name;
  document.getElementById("verfiy").href =
    window.location.protocol + "//" + url;

  function makeDownload() {
    document.getElementById("download-link").href =
      document.querySelector("#qrcode img").src;
  }
  setTimeout(makeDownload, 500);
  //  makeDownload();
}

//check old transaction and show them if exist
//Transactions in last afew hours will show but very old transactions wont show
// cuz the pastEvents returns transactions in last 999 block
async function listen() {
  console.log("started...");
  if (window.location.pathname != "/upload.html") return;
  document.querySelector(".loading-tx").classList.remove("d-none");
  window.web3 = new Web3(window.ethereum);
  window.contract = new window.web3.eth.Contract(
    window.CONTRACT.abi,
    window.CONTRACT.address
  );

  await window.contract.getPastEvents(
    "addHash",
    {
      filter: {
        _exporter: window.userAddress, //Only get the documents uploaded by current Exporter
      },
      fromBlock: (await window.web3.eth.getBlockNumber()) - 999,
      toBlock: "latest",
    },
    function (error, events) {
      printTransactions(events);
      console.log(events);
    }
  );
}

//If there is past tx then show them
function printTransactions(data) {
  document.querySelector(".transactions").innerHTML = "";
  document.querySelector(".loading-tx").classList.add("d-none");
  if (!data.length) {
    $("#recent-header").hide();
    return;
  }
  const main = document.querySelector(".transactions");
  for (let i = 0; i < data.length; i++) {
    const a = document.createElement("a");
    a.href = `${window.CONTRACT.explore}` + "/tx/" + data[i].transactionHash;
    a.setAttribute("target", "_blank");
    a.className =
      "col-lg-3 col-md-4 col-sm-5 m-2  bg-dark text-light rounded position-relative card";
    a.style = "overflow:hidden;";
    const image = document.createElement("object");
    image.style = "width:100%;height: 100%;";

    image.data = `https://ipfs.io/ipfs/${data[i].returnValues[1]}`;
    const num = document.createElement("h1");
    num.append(document.createTextNode(i + 1));
    a.appendChild(image);
    num.style =
      "position:absolute; left:4px; bottom: -20px;font-size:4rem; color: rgba(20, 63, 74, 0.35);";
    a.appendChild(num);
    main.prepend(a);
  }
  $("#recent-header").show();
}
