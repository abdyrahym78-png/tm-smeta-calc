import React, { useState, useRef } from 'react';

const MAX_FILES = 15;
const MAX_FILE_SIZE_MB = 15;
const MAX_TOTAL_SIZE_MB = 150;

export default function FileUploader({ files, setFiles }) {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  const formatSize = (bytes) => {
    return (bytes / (1024 * 1024)).toFixed(2) + ' МБ';
  };

  const totalSizeMB = files.reduce((acc, file) => acc + file.size, 0) / (1024 * 1024);

  const validateAndAddFiles = (newFiles) => {
    setErrorMsg('');
    let validFiles = [];
    let currentTotalMB = totalSizeMB;

    if (files.length + newFiles.length > MAX_FILES) {
      setErrorMsg(`⚠️ Максимум можно загрузить не более ${MAX_FILES} файлов.`);
      return;
    }

    for (const file of newFiles) {
      const fileSizeMB = file.size / (1024 * 1024);
      
      if (fileSizeMB > MAX_FILE_SIZE_MB) {
        setErrorMsg(`⚠️ Файл "${file.name}" превышает лимит в ${MAX_FILE_SIZE_MB} МБ.`);
        return;
      }

      if (currentTotalMB + fileSizeMB > MAX_TOTAL_SIZE_MB) {
        setErrorMsg(`⚠️ Общий размер файлов превышает лимит в ${MAX_TOTAL_SIZE_MB} МБ.`);
        return;
      }

      currentTotalMB += fileSizeMB;
      validFiles.push(file);
    }

    setFiles((prev) => [...prev, ...validFiles]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndAddFiles(Array.from(e.dataTransfer.files));
      e.dataTransfer.clearData();
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndAddFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setErrorMsg('');
  };

  return (
    <div style={{ margin: '20px 0', fontFamily: 'sans-serif' }}>
      {/* Drag & Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
        style={{
          border: isDragging ? '2px dashed #2563eb' : '2px dashed #cbd5e1',
          backgroundColor: isDragging ? '#eff6ff' : '#f8fafc',
          borderRadius: '12px',
          padding: '28px',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: isDragging ? '0 4px 12px rgba(37, 99, 235, 0.15)' : 'none'
        }}
      >
        <input
          type="file"
          multiple
          ref={fileInputRef}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          accept=".pdf,.dwg,.xlsx,.xls,.docx,.doc,.txt,.png,.jpg"
        />
        <div style={{ fontSize: '36px', marginBottom: '8px' }}>📂</div>
        <div style={{ fontWeight: '600', fontSize: '16px', color: '#1e293b' }}>
          Перетащите сюда чертежи и спецификации
        </div>
        <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
          или нажмите для выбора файлов с устройства
        </div>
        <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '8px' }}>
          Поддерживается до {MAX_FILES} файлов (до {MAX_FILE_SIZE_MB} МБ каждый, суммарно {MAX_TOTAL_SIZE_MB} МБ)
        </div>
      </div>

      {/* Ошибки валидации */}
      {errorMsg && (
        <div style={{ color: '#dc2626', backgroundColor: '#fef2f2', border: '1px solid #fecaca', padding: '10px', borderRadius: '8px', fontSize: '13px', marginTop: '10px' }}>
          {errorMsg}
        </div>
      )}

      {/* Список выбранных файлов */}
      {files.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>
            <span>Выбрано файлов: {files.length} из {MAX_FILES}</span>
            <span>Общий объем: {totalSizeMB.toFixed(2)} / {MAX_TOTAL_SIZE_MB} МБ</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '220px', overflowY: 'auto' }}>
            {files.map((file, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '13px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                  <span>📄</span>
                  <span style={{ fontWeight: '500', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '280px' }}>
                    {file.name}
                  </span>
                  <span style={{ color: '#94a3b8', fontSize: '11px' }}>
                    ({formatSize(file.size)})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                  style={{
                    border: 'none',
                    background: 'none',
                    color: '#ef4444',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    padding: '2px 8px'
                  }}
                  title="Удалить файл"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
