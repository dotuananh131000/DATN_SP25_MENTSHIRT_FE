const UseFormatMoney = (moneyString) => {
    if (!moneyString) return '';
    return moneyString.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0
      });
}
export default UseFormatMoney;