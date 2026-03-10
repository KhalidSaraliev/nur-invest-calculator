import { useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"

export default function App() {
  const [price, setPrice] = useState(100000)
  const [months, setMonths] = useState(6)
  const [noDown, setNoDown] = useState(true)
  const [downPayment, setDownPayment] = useState(0)

  const [clientName, setClientName] = useState("")
  const [clientPhone, setClientPhone] = useState("")
  const [productName, setProductName] = useState("")

  const ratesNoDown: Record<number, number> = {
    3: 16,
    4: 19,
    5: 23,
    6: 26,
    7: 30,
    8: 34,
    9: 38,
    10: 42,
    11: 46,
    12: 49,
  }

  const ratesWithDown: Record<number, number> = {
    3: 15,
    4: 18,
    5: 20,
    6: 21,
    7: 23,
    8: 25,
    9: 27,
    10: 29,
    11: 31,
    12: 36,
  }

  const minDownPercent = 25

  const formatMoney = (value: number) =>
    new Intl.NumberFormat("ru-RU").format(Math.round(value)) + " ₽"

  const cleanPhone = (value: string) => value.replace(/\D/g, "")

  const safePrice = Math.max(0, Number(price) || 0)
  const rate = noDown ? ratesNoDown[months] : ratesWithDown[months]
  const minDownAmount = Math.round(safePrice * minDownPercent / 100)

  const safeDownPayment = useMemo(() => {
    if (noDown) return 0
    return Math.max(0, Number(downPayment) || 0)
  }, [noDown, downPayment])

  const markup = useMemo(() => {
    return Math.round((safePrice * rate) / 100)
  }, [safePrice, rate])

  const total = useMemo(() => {
    return safePrice + markup
  }, [safePrice, markup])

  const financed = useMemo(() => {
    return noDown ? total : Math.max(0, total - safeDownPayment)
  }, [noDown, total, safeDownPayment])

  const monthly = useMemo(() => {
    return Math.round(financed / months)
  }, [financed, months])

  const isPhoneValid = cleanPhone(clientPhone).length >= 10
  const isNameValid = clientName.trim().length > 1
  const isProductValid = productName.trim().length > 1
  const isPriceValid = safePrice > 0

  const isDownPaymentValid = noDown || safeDownPayment >= minDownAmount

  const canSend =
    isNameValid &&
    isPhoneValid &&
    isProductValid &&
    isPriceValid &&
    isDownPaymentValid

  const waText = encodeURIComponent(
    `Здравствуйте! Хочу оформить рассрочку.

Имя: ${clientName || "-"}
Телефон: ${clientPhone || "-"}
Товар: ${productName || "-"}
Цена товара: ${formatMoney(safePrice)}
Срок: ${months} мес.
Формат: ${noDown ? "Без взноса" : "Со взносом"}
Наценка: ${rate}%
Первоначальный взнос: ${formatMoney(safeDownPayment)}
Итоговая сумма: ${formatMoney(total)}
К финансированию: ${formatMoney(financed)}
Ежемесячный платёж: ${formatMoney(monthly)}`
  )

  const whatsappLink = `https://wa.me/79289999810?text=${waText}`

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <Card className="w-full max-w-xl rounded-3xl p-6 space-y-6 shadow-sm">
        <div className="space-y-2">
          <Badge>NUR Invest</Badge>
          <h1 className="text-2xl font-bold">Калькулятор рассрочки</h1>
          <p className="text-sm text-slate-500">
            Рассчитай платёж и сразу отправь заявку в WhatsApp
          </p>
        </div>

        <div className="space-y-2">
          <Label>Название товара</Label>
          <Input
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Например, iPhone 15 Pro"
          />
          {!isProductValid && (
            <p className="text-sm text-red-500">Укажи название товара</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Цена товара</Label>
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value) || 0)}
            placeholder="Введите цену"
          />
          {isPriceValid && (
            <p className="text-sm text-slate-500">
              Текущая сумма: {formatMoney(safePrice)}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Срок рассрочки</Label>
          <Slider
            value={[months]}
            min={3}
            max={12}
            step={1}
            onValueChange={(v) => setMonths(v[0])}
          />
          <Badge>{months} месяцев</Badge>
        </div>

        <div className="flex items-center gap-3">
          <Checkbox
            checked={noDown}
            onCheckedChange={(v) => setNoDown(Boolean(v))}
          />
          <Label>Без первоначального взноса</Label>
        </div>

        {!noDown && (
          <div className="space-y-2">
            <Label>Первоначальный взнос</Label>
            <Input
              type="number"
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value) || 0)}
              placeholder={`Минимум ${formatMoney(minDownAmount)}`}
            />
            <p className="text-sm text-slate-500">
              Минимальный взнос: {minDownPercent}% ({formatMoney(minDownAmount)})
            </p>
            {!isDownPaymentValid && (
              <p className="text-sm text-red-500">
                Взнос слишком маленький. Минимум: {formatMoney(minDownAmount)}
              </p>
            )}
          </div>
        )}

        <div className="space-y-2 rounded-2xl bg-slate-50 p-4">
          <p>Наценка: {rate}%</p>
          <p>Итоговая сумма: {formatMoney(total)}</p>
          <p>К финансированию: {formatMoney(financed)}</p>
          <p className="text-sm text-slate-500">
            {noDown
              ? "Без первоначального взноса"
              : `Со взносом ${formatMoney(safeDownPayment)}`}
          </p>
          <p>Ежемесячный платёж:</p>
          <p className="text-3xl font-bold">{formatMoney(monthly)}</p>
        </div>

        <div className="space-y-2">
          <Label>Ваше имя</Label>
          <Input
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Введите имя"
          />
          {!isNameValid && (
            <p className="text-sm text-red-500">Укажи имя</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Ваш телефон</Label>
          <Input
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value)}
            placeholder="79991234567"
          />
          {!isPhoneValid && (
            <p className="text-sm text-red-500">
              Укажи корректный номер телефона
            </p>
          )}
        </div>

        <a
          href={canSend ? whatsappLink : undefined}
          target="_blank"
          rel="noreferrer"
          className={canSend ? "block" : "block pointer-events-none opacity-50"}
        >
          <Button className="w-full h-12 text-base">
            Оформить через WhatsApp
          </Button>
        </a>

        <p className="text-xs text-slate-500">
          Предварительный расчёт не является окончательным одобрением заявки.
        </p>
      </Card>
    </div>
  )
}