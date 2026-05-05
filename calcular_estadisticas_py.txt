import pandas as pd

def calcular_estadisticas(descargas):
    df = descargas[descargas["PAGO"] > 0]
    
    resultado = df.groupby("MODELO").agg(
        CANTIDAD    = ("PAGO", "count"),
        PROMEDIO    = ("PAGO", "mean"),
        MAXIMO      = ("PAGO", "max"),
        MINIMO      = ("PAGO", "min"),
        ESTRELLAS   = ("ESTRELLAS", "mean"),
        DESV        = ("ESTRELLAS", "std"),
        COMENTARIOS = ("COMENTARIO", "sum")
    )
    
    resultado = resultado.rename(columns={"DESV": "DESV. ESTRELLAS"})
    resultado["DESV. ESTRELLAS"] = resultado["DESV. ESTRELLAS"].fillna(0.0)
    resultado = resultado.round(2)
    resultado = resultado.sort_index()
    
    return resultado