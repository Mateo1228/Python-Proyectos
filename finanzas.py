def calcular_ahorro(meta, limite):
    print(f"\nMeta: {meta} euros | Límite mensual: {limite} euros")
    for meses in [3, 6, 9, 12]:
        ahorro_mensual = round(meta / meses, 2)
        if ahorro_mensual > limite:
            print(f"{meses} meses → {ahorro_mensual} euros/mes → Muy exigente")
        else:
            print(f"{meses} meses → {ahorro_mensual} euros/mes → Alcanzable")

def meses_necesarios(meta, limite):
    for meses in range(1, 25):
        ahorro_mensual = meta / meses
        if ahorro_mensual <= limite:
            print(f"Necesitas mínimo {meses} meses para mantenerte dentro de tu límite")
            ahorro_real = round(meta / meses, 2)
            print(f"Ahorrando {ahorro_real} euros/mes llegas exactamente en {meses} meses")
            break

meses_necesarios(10000, 2000)
calcular_ahorro(10000, 2000)