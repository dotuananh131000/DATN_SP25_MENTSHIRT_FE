import dayjs from "dayjs";

const UseFormatDate = (dateString) => {
    if (!dateString) return '';
    return dayjs(dateString).format('DD-MM-YYYY');
}
export default UseFormatDate;