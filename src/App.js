import Additem from "./Additem";
import Content from "./Content";
import Footer from "./Footer";
import Header from "./Header";
import SearchItem from './SearchItem';
import { useState , useEffect } from 'react';
import apiRequest from './apiRequest'; 

function App() {
  const API_URL = 'http://localhost:3500/items';
  const [items, setItems] = useState([]);
  const [newItem, setNewitem] = useState('');
  const [search, setSearch] = useState('');
  const [fetchError, setFetcherror] = useState(null);
  const [isLoading, setIsloading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw Error("Data not received");
        const listitem = await response.json();
        setItems(listitem);
        setFetcherror(null);
      } catch (err) {
        setFetcherror(err.message);
      } finally {
        setIsloading(false);
      }
    };
    
    setTimeout(() => {
      fetchItems();
    }, 2000);
  }, []);

  const addItem = async (item) => {
    const id = items.length ? items[items.length - 1].id + 1 : 1;
    const addNewItem = { id, checked: false, item };

    const listitem = [...items, addNewItem];
    setItems(listitem);

    const postOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(addNewItem),
    };

    const result = await apiRequest(API_URL, postOptions);
    if (result) setFetcherror(result);
  };

  const handleCheck = async (id) => {
    const listitem = items.map((item) => 
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setItems(listitem);

    const myitem = listitem.filter((item) => item.id === id);
    const updateOptions = {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ checked: myitem[0].checked }),
    };

    const requrl = `${API_URL}/${id}`; 
    const result = await apiRequest(requrl, updateOptions);
    if (result) setFetcherror(result);
  };

  const handleDelete = async (id) => {
    const listitem = items.filter((item) => item.id !== id);
    setItems(listitem);

    const deleteOptions = { method: 'DELETE' };
    const requrl = `${API_URL}/${id}`; 
    const result = await apiRequest(requrl, deleteOptions);
    if (result) setFetcherror(result);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newItem) return;
    addItem(newItem);
    setNewitem('');
  };

  return (
    <div className="App">
      <Header title="Monisha University" />
      <Additem
        newItem={newItem}
        setNewitem={setNewitem}
        handleSubmit={handleSubmit}
      />
      <SearchItem
        search={search}
        setSearch={setSearch}
      />
      <main>
        {isLoading && <p>Loading...</p>}
        {fetchError && <p>{`Error: ${fetchError}`}</p>}
        {!isLoading && !fetchError && (
          <Content
            items={items.filter((item) => item.item.toLowerCase().includes(search.toLowerCase()))}
            handleCheck={handleCheck}
            handleDelete={handleDelete}
          />
        )}
      </main>
      <Footer length={items.length} />
    </div>
  );
}

export default App;