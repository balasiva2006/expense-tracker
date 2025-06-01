// Vite + React + Tailwind CSS
// Expense Tracker Frontend Only (localStorage-based)

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const CATEGORIES = ['Food', 'Utilities', 'Entertainment', 'Salary', 'Others'];
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#a4de6c'];

function App() {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [form, setForm] = useState({
    type: 'income',
    amount: '',
    category: '',
    description: '',
    date: '',
  });

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addTransaction = () => {
    if (!form.amount || !form.category || !form.date) return;
    setTransactions([...transactions, { ...form, id: Date.now() }]);
    setForm({ type: 'income', amount: '', category: '', description: '', date: '' });
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter((tx) => tx.id !== id));
  };

  const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + parseFloat(t.amount), 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + parseFloat(t.amount), 0);
  const balance = income - expense;

  const pieData = CATEGORIES.map(cat => {
    const value = transactions.filter(t => t.category === cat && t.type === 'expense')
      .reduce((acc, t) => acc + parseFloat(t.amount), 0);
    return { name: cat, value };
  }).filter(d => d.value > 0);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Expense Tracker</h1>

      <Card className="mb-6">
        <CardContent className="flex flex-col md:flex-row justify-between items-center gap-6 p-4">
          <div className="text-center">
            <p className="text-lg font-medium">Income</p>
            <p className="text-green-600">₹{income.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-medium">Expense</p>
            <p className="text-red-600">₹{expense.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-medium">Balance</p>
            <p className="text-blue-600">₹{balance.toFixed(2)}</p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="add" className="mb-6">
        <TabsList>
          <TabsTrigger value="add">Add Transaction</TabsTrigger>
          <TabsTrigger value="view">View Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="add">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <select name="type" value={form.type} onChange={handleChange} className="border p-2 rounded">
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <Input name="amount" placeholder="Amount" value={form.amount} onChange={handleChange} />
            <select name="category" value={form.category} onChange={handleChange} className="border p-2 rounded">
              {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <Input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
            <Input name="date" type="date" value={form.date} onChange={handleChange} />
          </div>
          <Button className="mt-4" onClick={addTransaction}>Add</Button>
        </TabsContent>

        <TabsContent value="view">
          <div className="mt-4 space-y-4">
            {transactions.map((tx) => (
              <Card key={tx.id} className="p-4 flex flex-col md:flex-row justify-between items-center">
                <div>
                  <p className="font-medium">{tx.description || tx.category}</p>
                  <p className="text-sm text-gray-500">{tx.date} | {tx.type}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className={tx.type === 'income' ? 'text-green-600' : 'text-red-600'}>₹{parseFloat(tx.amount).toFixed(2)}</p>
                  <Button variant="destructive" onClick={() => deleteTransaction(tx.id)}>Delete</Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-2">Spending Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                dataKey="value"
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
