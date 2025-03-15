import axios from "axios";
import { GHN_ID, TOKEN_GHN } from "../../../api/endPoints";

const api_giaoHangNhanh = {
  async getProvince() {
    try {
      const response = await axios.get(
        `https://online-gateway.ghn.vn/shiip/public-api/master-data/province`,
        {
          headers: {
            "Content-Type": "application/json",
            Token: TOKEN_GHN,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.log("Lỗi khi gọi API province", error);
      throw error;
    }
  },
  async getDistrict(provinceID) {
    try {
      const response = await axios.get(
        `https://online-gateway.ghn.vn/shiip/public-api/master-data/district`,
        {
          headers: {
            "Content-Type": "application/json",
            Token: TOKEN_GHN,
          },
          params: {
            province_id: provinceID,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.log("Lỗi khi gọi API district", error);
      throw error;
    }
  },
  async getWard(districtID) {
    try {
      const response = await axios.get(
        `https://online-gateway.ghn.vn/shiip/public-api/master-data/ward`,
        {
          headers: {
            "Content-Type": "application/json",
            Token: TOKEN_GHN,
          },
          params: {
            district_id: districtID,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.log("Lỗi khi gọi API ward", error);
      throw error;
    }
  },
  async getServiceId(toDistrict) {
    try {
      const response = await axios.post(
        `https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services`,
        {
          shop_id: 5653296,
          from_district: 3440,
          to_district: toDistrict,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Token: TOKEN_GHN,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("Không thể gọi API dịch vụ vận chuyển", error);
      throw error;
    }
  },
  async getFeeGHN(serviceID, districtId, wardCode) {
    try {
      const response = await axios.post(
        `https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee`,
        {
          from_district_id: 3440,
          from_ward_code: "13010",
          service_id: serviceID,
          to_district_id: districtId,
          to_ward_code: wardCode,
          height: 50,
          length: 20,
          weight: 5000,
          width: 20,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Token: TOKEN_GHN,
            ShopId: GHN_ID,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("Lỗi khi gọi API phí ship", error);
      throw error;
    }
  },
};
export default api_giaoHangNhanh;
