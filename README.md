# microservicios-node

# Arquitectura de Microservicios

## 1. ¿Qué ventaja tiene separar usuarios, cursos y matrículas en servicios diferentes?

Cada servicio puede desarrollarse, desplegarse y escalarse de forma independiente. Si los cursos tienen mucho tráfico, solo escala ese servicio sin tocar los demás. Además, un fallo en matrículas no tumba el servicio de usuarios. También permite que equipos distintos trabajen en paralelo sin pisarse el código.

---

## 2. ¿Qué problema aparece si un microservicio se apaga?

Los servicios que dependen de él fallan en cascada si no hay manejo de errores. Por ejemplo, si el servicio de usuarios se cae, el de matrículas no puede verificar si el usuario existe y devuelve error.

Esto se conoce como fallo en cascada y se mitiga con patrones como:

- Circuit Breaker
- Respuestas fallback
- Reintentos controlados

---

## 3. ¿Por qué el API Gateway no debe guardar directamente todos los datos?

Porque rompería el principio de responsabilidad única. El Gateway es un punto de entrada y enrutamiento, no una capa de persistencia.

Si guarda datos:
- Se convierte en un monolito disfrazado
- Genera un cuello de botella
- Crea un único punto de fallo crítico

Su rol es redirigir, autenticar y balancear, no almacenar.

---

## 4. ¿Qué diferencia hay entre ejecutar los servicios manualmente y ejecutarlos con Docker Compose?

| Manual | Docker Compose |
|---|---|
| Levantar cada servicio por separado | Un solo comando levanta todo |
| Configurar puertos y variables a mano | Todo definido en `docker-compose.yml` |
| Difícil de replicar en otro equipo | Entorno reproducible garantizado |
| Sin red interna entre servicios | Red virtual compartida automática |
| Sin gestión de orden de inicio | Permite definir dependencias con `depends_on` |

---

## 5. ¿Qué cambiaría si se agregara una base de datos independiente para cada microservicio?

Sería la arquitectura correcta de microservicios.

### Beneficios:

- **Aislamiento real:** un fallo en una BD no afecta a las otras.
- **Tecnología libre por servicio:** usuarios podría usar PostgreSQL, cursos MongoDB, etc.
- **Sin acoplamiento de datos:** ningún servicio accede directamente a la tabla de otro.

---

