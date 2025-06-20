import React, { useEffect, useState } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

function AreaSelector({ onAreaChange }) {
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState("all");

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await fetch(`http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/areas/get`);
        const data = await response.json();
        setAreas(data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách khu vực:", error);
      }
    };

    fetchAreas();
  }, []);

  const handleChange = (event) => {
    const selectedId = event.target.value;
    setSelectedArea(selectedId);

    if (selectedId === "all") {
      onAreaChange(null);
    } else {
      const selectedAreaObj = areas.find(
        (area) => area.IdKhuVuc === selectedId
      );
      onAreaChange(selectedAreaObj);
    }
  };

  return (
    <FormControl sx={{ minWidth: 200 }}>
      <InputLabel id="area-select-label">Khu vực</InputLabel>
      <Select
        labelId="area-select-label"
        value={selectedArea}
        label="Khu vực"
        onChange={handleChange}
      >
        <MenuItem value="all">Tất cả khu vực</MenuItem>
        {areas.map((area) => (
          <MenuItem key={area.IdKhuVuc} value={area.IdKhuVuc}>
            {area.TenKhuVuc}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default AreaSelector;
