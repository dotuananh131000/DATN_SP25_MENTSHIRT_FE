const UseFormatMoney = (moneyString) => {
    return moneyString.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0
      });
}
export default UseFormatMoney;