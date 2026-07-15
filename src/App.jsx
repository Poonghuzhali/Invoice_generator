/* Task 2: Clean App.jsx - removed all boilerplate, starting with clean functional component */
/* Task 3: Basic Component Structure - empty functional component returning div */
import { useState, useEffect } from 'react'
/* Day 68 Task 2: Import jsPDF and jspdf-autotable libraries */
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import './App.css'

/* Task 21: Tax Rate Data - JavaScript object with tax rates for various categories */
const taxRates = {
  general: 0.18,
  materials: 0.28,
  services: 0.12,
}

function App() {
  /* Task 7: Invoice Number Input - useState for invoice number */
  const [invoiceNumber, setInvoiceNumber] = useState('')

  /* Task 8: Date Input - useState for invoice date */
  const [invoiceDate, setInvoiceDate] = useState('')

  /* Task 9: Client Information - useState for client name and address */
  const [clientName, setClientName] = useState('')
  const [clientAddress, setClientAddress] = useState('')

  /* Task 11: Initial Item State - array of objects with id, description, quantity, price, category */
  /* Task 22: Item Category State - added category key to each item object, initialized to 'general' */
  const [invoiceItems, setInvoiceItems] = useState([
    { id: 1, description: '', quantity: 1, price: 0, category: 'general' },
  ])

  /* Task 18: Subtotal Calculation - state variable for subtotal */
  const [subtotal, setSubtotal] = useState(0)

  /* Task 25: GST State - state variable for total GST */
  const [totalGST, setTotalGST] = useState(0)

  /* Task 19: Grand Total - state variable for grand total */
  const [grandTotal, setGrandTotal] = useState(0)

  /* Task 16: calculateItemTotal - function that returns quantity * price */
  const calculateItemTotal = (quantity, price) => {
    return quantity * price
  }

  /* Task 31: Auto-Detection Function - takes item description as string */
  /* Task 32: Keyword Logic - checks for keywords like 'cement', 'steel', 'consulting' */
  /* Task 33: Return Category - returns corresponding category or 'general' */
  const autoDetectCategory = (description) => {
    const lowerDesc = description.toLowerCase()
    if (lowerDesc.includes('cement') || lowerDesc.includes('steel') || lowerDesc.includes('brick') || lowerDesc.includes('wood') || lowerDesc.includes('pipe') || lowerDesc.includes('material')) {
      return 'materials'
    } else if (lowerDesc.includes('consulting') || lowerDesc.includes('service') || lowerDesc.includes('labor') || lowerDesc.includes('installation') || lowerDesc.includes('repair')) {
      return 'services'
    } else {
      return 'general'
    }
  }

  /* Task 18: useEffect - recalculates subtotal, GST, and grand total when invoiceItems changes */
  /* Task 26: Update useEffect Hook - also calculates total GST */
  /* Task 27: GST Calculation Logic */
  /* Task 28: Grand Total Logic - adds subtotal and totalGST */
  useEffect(() => {
    let newSubtotal = 0
    let newGST = 0

    invoiceItems.forEach((item) => {
      const itemTotal = calculateItemTotal(item.quantity, item.price)
      newSubtotal += itemTotal

      /* Task 27: GST Calculation - multiply item total by category tax rate */
      const taxRate = taxRates[item.category] || taxRates.general
      newGST += itemTotal * taxRate
    })

    setSubtotal(newSubtotal)
    setTotalGST(newGST)
    setGrandTotal(newSubtotal + newGST)
  }, [invoiceItems])

  /* Task 15: Add Item Logic - adds new empty item object to invoiceItems state array */
  const handleAddItem = () => {
    const newItem = {
      id: Date.now(),
      description: '',
      quantity: 1,
      price: 0,
      category: 'general',
    }
    setInvoiceItems([...invoiceItems, newItem])
  }

  /* Task 40: Remove Button - filters the item out of the items state array */
  const handleRemoveItem = (id) => {
    if (invoiceItems.length === 1) return
    setInvoiceItems(invoiceItems.filter((item) => item.id !== id))
  }

  /* Task 13: Input Handlers - onChange handler that updates corresponding state variable */
  const handleItemChange = (id, field, value) => {
    setInvoiceItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }

          /* Task 34: Integrate Auto-Detection - call autoDetectCategory on description change */
          /* Task 35: Update State on Change - update category value */
          if (field === 'description') {
            const detectedCategory = autoDetectCategory(value)
            updatedItem.category = detectedCategory
          }

          return updatedItem
        }
        return item
      })
    )
  }

  /* Day 68 Task 4: Create PDF Function - generatePDF */
  /* Day 68 Task 5: Initialize jsPDF */
  /* Day 68 Task 6: Add Invoice Header */
  /* Day 68 Task 7: Add Client Information */
  /* Day 68 Task 8: Prepare Table Data */
  /* Day 68 Task 9: Generate Table with autotable */
  /* Day 68 Task 10: Add Total Rows */
  /* Day 68 Task 11: Finalize PDF with doc.save() */
  /* Day 68 Task 20: All currency values formatted with toFixed(2) */
  const generatePDF = () => {
    /* Day 68 Task 5: Initialize jsPDF instance */
    const doc = new jsPDF()

    /* Day 68 Task 6: Add Invoice Header - title, invoice number, date */
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('Invoice', 14, 20)

    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.text(`Invoice Number: ${invoiceNumber || 'N/A'}`, 14, 30)
    doc.text(`Date: ${invoiceDate || 'N/A'}`, 14, 37)

    /* Day 68 Task 7: Add Client Information - name and address */
    doc.setFont('helvetica', 'bold')
    doc.text('Bill To:', 14, 48)
    doc.setFont('helvetica', 'normal')
    doc.text(`Client Name: ${clientName || 'N/A'}`, 14, 55)
    doc.text(`Client Address: ${clientAddress || 'N/A'}`, 14, 62)

    /* Day 68 Task 8: Prepare Table Data from items state */
    /* Day 68 Task 20: Currency values formatted with toFixed(2) */
    const tableColumn = ['Description', 'Category', 'Qty', 'Price', 'Total']
    const tableRows = invoiceItems.map((item) => [
      item.description || '-',
      item.category.charAt(0).toUpperCase() + item.category.slice(1),
      item.quantity.toString(),
      `$${item.price.toFixed(2)}`,
      `$${calculateItemTotal(item.quantity, item.price).toFixed(2)}`,
    ])

    /* Day 68 Task 9: Generate Table with autoTable() */
    autoTable(doc, {
      startY: 70,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [67, 97, 238], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [248, 249, 255] },
      styles: { fontSize: 10 },
    })

    /* Day 68 Task 10: Add Total Rows - subtotal, GST, grand total */
    const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 12 : 90

    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Totals:', 120, finalY)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 120, finalY + 8)
    doc.text(`Total GST: $${totalGST.toFixed(2)}`, 120, finalY + 15)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(13)
    doc.text(`Grand Total: $${grandTotal.toFixed(2)}`, 120, finalY + 24)

    /* Day 68 Task 11: Finalize PDF - save as invoice.pdf */
    doc.save('invoice.pdf')
  }

  return (
    /* Task 4: Main Layout - main container with class invoice-container */
    <div className="invoice-container">
      {/* Task 5: Form Title - h1 with text "Invoice Generator" */}
      <h1 className="invoice-title">Invoice Generator</h1>

      {/* Task 6: Invoice Header Section */}
      <div className="invoice-header">
        {/* Task 7: Invoice Number Input */}
        <div className="header-field">
          <label><span className="task-badge">Task 7</span> Invoice Number:</label>
          <input
            type="text"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            placeholder="INV-001"
          />
        </div>
        {/* Task 8: Date Input */}
        <div className="header-field">
          <label><span className="task-badge">Task 8</span> Date:</label>
          <input
            type="date"
            value={invoiceDate}
            onChange={(e) => setInvoiceDate(e.target.value)}
          />
        </div>
      </div>

      {/* Task 9: Client Information Section */}
      <div className="client-info">
        <h2><span className="task-badge">Task 9</span> Client Information</h2>
        <div className="client-fields">
          <div className="client-field">
            <label>Client Name:</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Enter client name"
            />
          </div>
          <div className="client-field">
            <label>Client Address:</label>
            <input
              type="text"
              value={clientAddress}
              onChange={(e) => setClientAddress(e.target.value)}
              placeholder="Enter client address"
            />
          </div>
        </div>
      </div>

      {/* Task 10: Items Table */}
      <div className="items-section">
        <h2><span className="task-badge">Task 10, 12</span> Invoice Items</h2>
        <table className="items-table">
          <thead>
            <tr>
              <th>#</th>
              <th><span className="task-badge-th">Task 13</span> Description</th>
              <th>Quantity</th>
              <th>Price</th>
              {/* Task 23: Category column */}
              <th><span className="task-badge-th">Task 23, 24</span> Category</th>
              {/* Task 17: Total column */}
              <th><span className="task-badge-th">Task 16, 17</span> Total</th>
              {/* Task 40: Action column */}
              <th><span className="task-badge-th">Task 40</span> Action</th>
            </tr>
          </thead>
          <tbody>
            {/* Task 12: Mapping Items - use map() to render each item */}
            {invoiceItems.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) =>
                      handleItemChange(item.id, 'description', e.target.value)
                    }
                    placeholder="e.g. Steel beams, Cement, Consulting"
                  />
                  {/* Task 36: User Feedback - "Auto-detected" */}
                  {item.category !== 'general' && item.description && (
                    <span className="auto-detected">Task 31-35: Auto-detected</span>
                  )}
                </td>
                <td>
                  <input
                    type="number"
                    value={item.quantity}
                    min="1"
                    onChange={(e) =>
                      handleItemChange(
                        item.id,
                        'quantity',
                        parseInt(e.target.value) || 0
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.price}
                    min="0"
                    step="0.01"
                    onChange={(e) =>
                      handleItemChange(
                        item.id,
                        'price',
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </td>
                {/* Task 23: Category dropdown populated from taxRates object */}
                {/* Task 24: Handle Category Change */}
                <td>
                  <select
                    value={item.category}
                    onChange={(e) =>
                      handleItemChange(item.id, 'category', e.target.value)
                    }
                  >
                    {Object.keys(taxRates).map((category) => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}{' '}
                        ({(taxRates[category] * 100).toFixed(0)}%)
                      </option>
                    ))}
                  </select>
                </td>
                {/* Task 17: Dynamic Total Display */}
                <td className="item-total">
                  ${calculateItemTotal(item.quantity, item.price).toFixed(2)}
                </td>
                {/* Task 40: Remove Button */}
                <td>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={invoiceItems.length === 1}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Task 14: Add Item Button */}
        <button className="add-item-btn" onClick={handleAddItem}>
          Task 14, 15: Add New Item
        </button>
      </div>

      {/* Task 37: Refactor Totals Display */}
      {/* Task 19: Grand Total Section */}
      <div className="totals-section">
        <h3 className="totals-heading"><span className="task-badge">Task 18, 19, 20, 25-30, 37, 38</span> Totals Summary</h3>
        <div className="totals-row">
          <span>Subtotal (Task 18):</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        {/* Task 29: Display GST */}
        <div className="totals-row">
          <span>Total GST (Task 25, 27, 29):</span>
          <span>${totalGST.toFixed(2)}</span>
        </div>
        {/* Task 30: Display Grand Total */}
        <div className="totals-row grand-total">
          <span>Grand Total (Task 28, 30):</span>
          <span>${grandTotal.toFixed(2)}</span>
        </div>
        {/* Day 68 Task 3: Export as PDF Button */}
        {/* Day 68 Task 12: Trigger PDF Generation on click */}
        <button className="pdf-btn" onClick={generatePDF}>
          Day 68 Task 3, 12: Export as PDF
        </button>
      </div>

      {/* Day 68 Task 13: Invoice Summary Section Container */}
      <div className="invoice-summary">
        {/* Day 68 Task 14: Summary Title */}
        <h2><span className="task-badge">Day 68 Task 13-17</span> Invoice Summary</h2>
        <div className="summary-grid">
          {/* Day 68 Task 15: Display Key Details */}
          <div className="summary-item">
            <strong>Invoice Number:</strong>
            <p>{invoiceNumber || 'N/A'}</p>
          </div>
          <div className="summary-item">
            <strong>Invoice Date:</strong>
            <p>{invoiceDate || 'N/A'}</p>
          </div>
          <div className="summary-item">
            <strong>Client Name:</strong>
            <p>{clientName || 'N/A'}</p>
          </div>
          <div className="summary-item">
            <strong>Client Address:</strong>
            <p>{clientAddress || 'N/A'}</p>
          </div>
          {/* Day 68 Task 16: Display Final Totals */}
          <div className="summary-item summary-totals">
            <strong>Subtotal:</strong>
            <p>${subtotal.toFixed(2)}</p>
          </div>
          <div className="summary-item summary-totals">
            <strong>Total GST:</strong>
            <p>${totalGST.toFixed(2)}</p>
          </div>
          <div className="summary-item summary-grand-total">
            <strong>Grand Total:</strong>
            <p>${grandTotal.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Task 39 / Day 68 Task 18: Final Review - Task List Display */}
      <div className="tasks-list">
        <h2><span className="task-badge">Day 68 Task 18, 19, 20</span> All Completed Tasks</h2>

        {/* Day 66-67 Tasks */}
        <h3 className="task-section-title">Day 66-67 (Tasks 1-40)</h3>
        <div className="tasks-grid">
          <div className="task-item completed"><strong>Task 1:</strong> Vite Project Setup</div>
          <div className="task-item completed"><strong>Task 2:</strong> Clean App.jsx</div>
          <div className="task-item completed"><strong>Task 3:</strong> Basic Component Structure</div>
          <div className="task-item completed"><strong>Task 4:</strong> Main Layout (invoice-container)</div>
          <div className="task-item completed"><strong>Task 5:</strong> Form Title</div>
          <div className="task-item completed"><strong>Task 6:</strong> Invoice Header Section</div>
          <div className="task-item completed"><strong>Task 7:</strong> Invoice Number Input</div>
          <div className="task-item completed"><strong>Task 8:</strong> Date Input</div>
          <div className="task-item completed"><strong>Task 9:</strong> Client Information</div>
          <div className="task-item completed"><strong>Task 10:</strong> Items Table</div>
          <div className="task-item completed"><strong>Task 11:</strong> Initial Item State</div>
          <div className="task-item completed"><strong>Task 12:</strong> Mapping Items</div>
          <div className="task-item completed"><strong>Task 13:</strong> Input Handlers</div>
          <div className="task-item completed"><strong>Task 14:</strong> Add Item Button</div>
          <div className="task-item completed"><strong>Task 15:</strong> Add Item Logic</div>
          <div className="task-item completed"><strong>Task 16:</strong> calculateItemTotal</div>
          <div className="task-item completed"><strong>Task 17:</strong> Dynamic Total Display</div>
          <div className="task-item completed"><strong>Task 18:</strong> Subtotal Calculation</div>
          <div className="task-item completed"><strong>Task 19:</strong> Grand Total Section</div>
          <div className="task-item completed"><strong>Task 20:</strong> Auto-Updating Display</div>
          <div className="task-item completed"><strong>Task 21:</strong> Tax Rate Data Object</div>
          <div className="task-item completed"><strong>Task 22:</strong> Item Category State</div>
          <div className="task-item completed"><strong>Task 23:</strong> Category Dropdown</div>
          <div className="task-item completed"><strong>Task 24:</strong> Handle Category Change</div>
          <div className="task-item completed"><strong>Task 25:</strong> GST State</div>
          <div className="task-item completed"><strong>Task 26:</strong> Update useEffect</div>
          <div className="task-item completed"><strong>Task 27:</strong> GST Calculation</div>
          <div className="task-item completed"><strong>Task 28:</strong> Grand Total Logic</div>
          <div className="task-item completed"><strong>Task 29:</strong> Display GST</div>
          <div className="task-item completed"><strong>Task 30:</strong> Display Grand Total</div>
          <div className="task-item completed"><strong>Task 31:</strong> Auto-Detection Function</div>
          <div className="task-item completed"><strong>Task 32:</strong> Keyword Logic</div>
          <div className="task-item completed"><strong>Task 33:</strong> Return Category</div>
          <div className="task-item completed"><strong>Task 34:</strong> Integrate Auto-Detection</div>
          <div className="task-item completed"><strong>Task 35:</strong> Update State on Change</div>
          <div className="task-item completed"><strong>Task 36:</strong> User Feedback</div>
          <div className="task-item completed"><strong>Task 37:</strong> Refactor Totals Display</div>
          <div className="task-item completed"><strong>Task 38:</strong> Cleanup & Formatting</div>
          <div className="task-item completed"><strong>Task 39:</strong> Final Review</div>
          <div className="task-item completed"><strong>Task 40:</strong> Add Remove Button</div>
        </div>

        {/* Day 68 Tasks */}
        <h3 className="task-section-title day68">Day 68 (Tasks 1-20)</h3>
        <div className="tasks-grid">
          <div className="task-item completed"><strong>Day 68 Task 1:</strong> Install jspdf & jspdf-autotable</div>
          <div className="task-item completed"><strong>Day 68 Task 2:</strong> Import jsPDF Libraries</div>
          <div className="task-item completed"><strong>Day 68 Task 3:</strong> Export as PDF Button</div>
          <div className="task-item completed"><strong>Day 68 Task 4:</strong> Create generatePDF Function</div>
          <div className="task-item completed"><strong>Day 68 Task 5:</strong> Initialize jsPDF Instance</div>
          <div className="task-item completed"><strong>Day 68 Task 6:</strong> Add Invoice Header to PDF</div>
          <div className="task-item completed"><strong>Day 68 Task 7:</strong> Add Client Info to PDF</div>
          <div className="task-item completed"><strong>Day 68 Task 8:</strong> Prepare Table Data</div>
          <div className="task-item completed"><strong>Day 68 Task 9:</strong> Generate Table with autoTable</div>
          <div className="task-item completed"><strong>Day 68 Task 10:</strong> Add Total Rows to PDF</div>
          <div className="task-item completed"><strong>Day 68 Task 11:</strong> Finalize PDF (doc.save)</div>
          <div className="task-item completed"><strong>Day 68 Task 12:</strong> Link Button to generatePDF</div>
          <div className="task-item completed"><strong>Day 68 Task 13:</strong> Summary Section Container</div>
          <div className="task-item completed"><strong>Day 68 Task 14:</strong> Summary Title</div>
          <div className="task-item completed"><strong>Day 68 Task 15:</strong> Display Key Details</div>
          <div className="task-item completed"><strong>Day 68 Task 16:</strong> Display Final Totals</div>
          <div className="task-item completed"><strong>Day 68 Task 17:</strong> Style Summary Section</div>
          <div className="task-item completed"><strong>Day 68 Task 18:</strong> Final Test</div>
          <div className="task-item completed"><strong>Day 68 Task 19:</strong> Test PDF Export</div>
          <div className="task-item completed"><strong>Day 68 Task 20:</strong> Code Cleanup (toFixed(2))</div>
        </div>
      </div>
    </div>
  )
}

export default App
