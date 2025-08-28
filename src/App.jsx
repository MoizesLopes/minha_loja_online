import React, { useMemo, useState, useEffect } from 'react'
import { PRODUCTS } from './data/products'

const currency = (n)=> n.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})

// Simple local login for testing: saved in localStorage as 'user'.
// Default test credentials: user: admin@example.com, pass: 123456
function Login({ onLogin }){
  const [email,setEmail]=useState('admin@example.com')
  const [pass,setPass]=useState('123456')
  const submit=(e)=>{
    e.preventDefault()
    // naive check - in real app use backend
    if(email && pass){
      const user={email}
      localStorage.setItem('user',JSON.stringify(user))
      onLogin(user)
    }
  }
  return (
    <form onSubmit={submit} style={{display:'flex',gap:8,alignItems:'center'}}>
      <input className='input' value={email} onChange={e=>setEmail(e.target.value)} />
      <input className='input' value={pass} onChange={e=>setPass(e.target.value)} />
      <button className='btn' type='submit'>Entrar</button>
    </form>
  )
}

function useCart(){
  const [items,setItems]=useState(()=>{
    try{ return JSON.parse(localStorage.getItem('cart')||'[]') }catch{ return [] }
  })
  useEffect(()=> localStorage.setItem('cart', JSON.stringify(items)),[items])
  const add=(p)=> setItems(prev=>{ const found=prev.find(x=>x.id===p.id); if(found) return prev.map(x=>x.id===p.id?{...x,qty:x.qty+1}:x); return [...prev,{id:p.id,name:p.name,price:p.price,qty:1}]})
  const inc=(id)=> setItems(prev=>prev.map(x=>x.id===id?{...x,qty:x.qty+1}:x))
  const dec=(id)=> setItems(prev=>prev.map(x=>x.id===id?{...x,qty:Math.max(0,x.qty-1)}:x).filter(x=>x.qty>0))
  const remove=(id)=> setItems(prev=>prev.filter(x=>x.id!==id))
  const clear=()=> setItems([])
  const total=useMemo(()=> items.reduce((s,x)=>s+x.price*x.qty,0),[items])
  const count=useMemo(()=> items.reduce((s,x)=>s+x.qty,0),[items])
  return {items,add,inc,dec,remove,clear,total,count}
}

export default function App(){
  const [user,setUser]=useState(()=>{ try{return JSON.parse(localStorage.getItem('user'))}catch{return null} })
  const cart = useCart()
  const [query,setQuery]=useState('')
  const [category,setCategory]=useState('Todos')
  const categories = ['Todos',...Array.from(new Set(PRODUCTS.map(p=>p.category)))]
  const filtered = useMemo(()=> PRODUCTS.filter(p=> (category==='Todos'||p.category===category) && (!query || p.name.toLowerCase().includes(query.toLowerCase()) || p.description.toLowerCase().includes(query.toLowerCase()))),[query,category])

  const confirmOrder=(form)=>{
    const order = { id:Date.now(), user: user?.email||'guest', form, items:cart.items, total:cart.total, createdAt: new Date().toISOString() }
    // In prototype we just show alert and clear cart. In real app POST to backend.
    alert('Pedido confirmado!\n\n' + JSON.stringify(order,null,2))
    cart.clear()
  }

  return (
    <div className='container'>
      <div className='header'>
        <div className='brand'>
          <div className='logo'>🛍️</div>
          <div>
            <div style={{fontWeight:700}}>Minha Lojinha</div>
            <div style={{fontSize:12,color:'#6b7280'}}>Protótipo — Web</div>
          </div>
        </div>

        <div style={{flex:1, marginLeft:12}}>
          <input className='input' placeholder='Buscar produtos...' value={query} onChange={e=>setQuery(e.target.value)} />
        </div>

        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <select className='input' value={category} onChange={e=>setCategory(e.target.value)} style={{width:160}}>
            {categories.map(c=> <option key={c} value={c}>{c}</option>)}
          </select>

          <div style={{display:'flex',alignItems:'center',gap:8}}>
            {user?(
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <div style={{fontSize:13,color:'#374151'}}>{user.email}</div>
                <button className='btn' onClick={()=>{ localStorage.removeItem('user'); setUser(null); }}>Sair</button>
              </div>
            ):(
              <Login onLogin={u=>setUser(u)} />
            )}
          </div>

          <div style={{position:'relative'}}>
            <button className='btn cart-btn' onClick={()=>{ const el=document.getElementById('sidebar'); el.style.display='block' }}>
              Carrinho
            </button>
            {cart.count>0 && <div className='cart-count'>{cart.count}</div>}
          </div>
        </div>
      </div>

      <div className='grid'>
        {filtered.map(p=>(
          <div className='card' key={p.id}>
            <img src={p.img} alt={p.name} />
            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <div className='bottom'>
              <div style={{fontWeight:700}}>{currency(p.price)}</div>
              <button className='btn' onClick={()=>cart.add(p)}>Adicionar</button>
            </div>
          </div>
        ))}
      </div>

      <div id='sidebar' className='sidebar' style={{display:'none'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
          <div style={{fontWeight:700}}>Seu carrinho</div>
          <div style={{fontSize:13,color:'#6b7280',cursor:'pointer'}} onClick={()=>{ document.getElementById('sidebar').style.display='none' }}>Fechar</div>
        </div>

        {cart.items.length===0 ? <div className='small'>Seu carrinho está vazio.</div> : (
          <div>
            {cart.items.map(i=>(
              <div key={i.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                <div>
                  <div style={{fontWeight:600}}>{i.name}</div>
                  <div className='small'>{currency(i.price)} • qtd {i.qty}</div>
                </div>
                <div style={{display:'flex',gap:6}}>
                  <button className='btn' onClick={()=>cart.dec(i.id)}>-</button>
                  <button className='btn' onClick={()=>cart.inc(i.id)}>+</button>
                  <button className='btn' onClick={()=>cart.remove(i.id)}>Remover</button>
                </div>
              </div>
            ))}

            <hr style={{border:'none',height:1,background:'#eef2f7',margin:'12px 0'}} />
            <div className='row' style={{marginBottom:12}}>
              <div className='small'>Subtotal</div>
              <div style={{fontWeight:700}}>{currency(cart.total)}</div>
            </div>

            <div style={{marginBottom:8,fontWeight:600}}>Finalizar pedido</div>
            <form className='form' onSubmit={(e)=>{ e.preventDefault(); const form={ name:e.target.name.value, phone:e.target.phone.value, address:e.target.address.value, payment:e.target.payment.value, obs:e.target.obs.value }; confirmOrder(form); document.getElementById('sidebar').style.display='none' }}>
              <label className='small'>Nome</label>
              <input name='name' required />
              <label className='small'>Telefone</label>
              <input name='phone' required />
              <label className='small'>Endereço</label>
              <input name='address' required />
              <label className='small'>Pagamento</label>
              <select name='payment'>
                <option value='pix'>PIX</option>
                <option value='cartao'>Cartão</option>
                <option value='dinheiro'>Dinheiro</option>
              </select>
              <label className='small'>Observações</label>
              <textarea name='obs' rows={2} />
              <div style={{marginTop:8,display:'flex',gap:8}}>
                <button className='btn' type='submit'>Confirmar pedido</button>
                <button className='btn' type='button' onClick={()=>cart.clear()}>Limpar</button>
              </div>
            </form>
          </div>
        )}
      </div>

      <div className='footer'>© {new Date().getFullYear()} Minha Lojinha — Protótipo • Teste local</div>
    </div>
  )
}
