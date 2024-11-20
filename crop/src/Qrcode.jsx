import React from 'react';
import { QRCode } from 'react-qr-code';

const QRCodeComponent = ({ value, bgColor, fgColor, size }) => {
  return (
    <div>
      <QRCode
        value={value}
        bgColor={bgColor}
        fgColor={fgColor}
        size={size}
      />
    </div>
  );
};

export default QRCodeComponent;