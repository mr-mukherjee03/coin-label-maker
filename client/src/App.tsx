import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Barcode from 'react-barcode';
import axios from 'axios';
import type { CoinLabelData } from '../../shared/types';
import './App.css'; // We will style this next

function App() {
  const [uniqueId, setUniqueId] = useState<string>('Loading...');

  // Setup form handling
  const { register, watch, handleSubmit } = useForm<CoinLabelData>({
    defaultValues: {
      year: '',
      denomination: '',
      mintMark: ''
    }
  });

  // Watch inputs for the "Live Preview"
  const values = watch();

  // 1. On Load: Get a reserved ID from server
  useEffect(() => {
    axios.get('http://localhost:4000/api/generate-id')
      .then(res => setUniqueId(res.data.id))
      .catch(err => console.error("Server not reachable", err));
  }, []);

  // 2. Handle "Print Label"
  // 2. Handle "Print Label"
  const onPrint = async (data: CoinLabelData) => {
    try {
      // Combine form data with the reserved ID
      const payload: CoinLabelData = { ...data, id: uniqueId };

      // Request PDF from Backend
      const response = await axios.post('http://localhost:4000/api/print-label', payload, {
        responseType: 'blob' // FORCE binary response
      });

      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });

      // Create a URL for the PDF blob
      const pdfUrl = window.URL.createObjectURL(pdfBlob);

      // Open print dialog in new tab
      window.open(pdfUrl, '_blank');

    } catch (error) {
      alert('Failed to print label');
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h2>Add Raw Coin</h2>

      <div className="layout">
        {/* LEFT COLUMN: Form */}
        <form className="form-panel" onSubmit={handleSubmit(onPrint)}>

          <label>Year *</label>
          <input {...register("year", { required: true })} placeholder="e.g., 1921" />

          <label>Denomination *</label>
          <input {...register("denomination", { required: true })} placeholder="e.g., Morgan Dollar" />

          <label>Mint Mark</label>
          <input {...register("mintMark")} placeholder="e.g., S, D, O" />

          {/* Just visual fields to match your screenshot */}
          <div className="row">
            <div>
              <label>Purchase Price</label>
              <input type="number" placeholder="$ 0.00" />
            </div>
            <div>
              <label>Purchase Date</label>
              <input type="date" />
            </div>
          </div>

          <label>Notes</label>
          <textarea rows={3} placeholder="Any additional notes..."></textarea>
        </form>

        {/* RIGHT COLUMN: Preview & ID */}
        <div className="preview-panel">

          {/* Static ID Box */}
          <div className="id-card">
            <span className="label-title">Internal ID</span>
            <div className="id-box">
              <h3>{uniqueId}</h3>
              <small>Auto-generated</small>
            </div>
            <p className="help-text">This unique ID will be used to track this coin.</p>
          </div>

          {/* The Label Preview (Visual Only) */}
          <div className="label-preview-container">
            <span className="label-title">Label Preview</span>

            <div className="sticker-visual">
              <div className="sticker-text">
                {values.year || 'YEAR'} {values.denomination || 'DENOMINATION'}
              </div>

              {/* React Barcode Component (Visual Approximation) */}
              <div className="sticker-barcode">
                <Barcode
                  value={uniqueId}
                  width={1.5}
                  height={40}
                  displayValue={false}
                  margin={5}
                />
              </div>

              <div className="sticker-footer">
                <div className="sticker-id">{uniqueId}</div>
                <div className="sticker-status">RAW</div>
              </div>
            </div>

            <button onClick={handleSubmit(onPrint)} className="print-btn">
              🖨 Print Label
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;