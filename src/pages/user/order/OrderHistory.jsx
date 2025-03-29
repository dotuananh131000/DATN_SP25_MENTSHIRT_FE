import {motion} from "framer-motion"
function OrderHistory() {
    return <motion.div className="bg-gradient-to-b from-orange-50 to-white min-h-screen"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}>

    </motion.div>;
  }
  export default OrderHistory;