import Web3 from 'web3'
import logo from './logo.svg';
import './App.css';

function App() {
  useEffect(() => {

    setLoading(false)
    const load = async () => {
      if (window.ethereum) {

        const web3 = new Web3(window.ethereum)
        let acc = await web3.eth.getAccounts()
        setAccount(acc[0])

        const contract = new web3.eth.Contract(todo_abi, contractAddress)
        setContract(contract)
        if (contract) {
          const fileHash = await contract.methods.display(acc[0]).call()
          if (fileHash) {
            const bufferedContents = await toBuffer(client.cat(fileHash)) // returns a Buffer
            const text = new TextDecoder("utf-8").decode(bufferedContents)
            setTask(JSON.parse(text))
          }
          else {
            setTask([])
          }
        }

        window.ethereum.on('accountsChanged', function (accounts) {
          setAccount(accounts)
          setLoading(true)

        });
      }
      else {
        window.alert("No Ethereum Wallet Found")
      }

    }
    load()
  }, [loading])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
