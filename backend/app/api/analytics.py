# from jose import JWTError, jwt
# from datetime import datetime, timedelta

# SECRET_KEY = "your-secret-key"
# ALGORITHM = "HS256"
# ACCESS_TOKEN_EXPIRE_MINUTES = 30

# @router.get("/traffic")
# async def get_traffic(db: Session = Depends(get_db)):
#     traffic = crud.get_traffic(db)
#     return traffic
# @router.get("/traffic/{traffic_id}")
# async def get_traffic(traffic_id: int, db: Session = Depends(get_db)):
#     traffic = crud.get_traffic(db, traffic_id)
#     if not traffic:
#         raise HTTPException(status_code=404, detail="Traffic not found")
#     return traffic
# @router.post("/traffic")
# async def create_traffic(traffic: schemas.TrafficCreate, db: Session = Depends(get_db)):
#     db_traffic = crud.get_traffic_by_name(db, traffic.name)
#     if db_traffic:
#         raise HTTPException(status_code=400, detail="Traffic already registered")
#     crud.create_traffic(db=db, traffic=traffic)
#     return {"message": "Traffic created successfully"}
# @router.put("/traffic/{traffic_id}")
# async def update_traffic(traffic_id: int, traffic: schemas.TrafficUpdate, db: Session = Depends(get_db)):
#     db_traffic = crud.get_traffic(db, traffic_id)
#     if not db_traffic:
#         raise HTTPException(status_code=404, detail="Traffic not found")
#     crud.update_traffic(db=db, traffic=traffic)
#     return {"message": "Traffic updated successfully"}
# @router.delete("/traffic/{traffic_id}")
# async def delete_traffic(traffic_id: int, db: Session = Depends(get_db)):
#     db_traffic = crud.get_traffic(db, traffic_id)
#     if not db_traffic:
#         raise HTTPException(status_code=404, detail="Traffic not found")
#     crud.delete_traffic(db=db, traffic_id=traffic_id)
#     return {"message": "Traffic deleted successfully"}