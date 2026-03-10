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
  const minDownAmount = Math.round((safePrice * minDownPercent) / 100)

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

  const scrollToCalc = () => {
    const el = document.getElementById("calculator")
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto max-w-5xl px-4 py-6 md:py-10">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-slate-950 p-6 md:p-8 text-white">
            <Badge className="mb-4 bg-white text-slate-950 hover:bg-white">
              NUR Invest
            </Badge>

            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
              Рассчитайте рассрочку за 1 минуту
            </h1>

            <p className="mt-4 text-base md:text-lg text-slate-300 leading-7">
              Быстрый предварительный расчёт без лишней волокиты. Узнайте
              ежемесячный платёж и сразу отправьте заявку в WhatsApp.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="font-semibold">Без банка</p>
                <p className="mt-1 text-sm text-slate-300">
                  Предварительный расчёт онлайн без долгих походов и очередей.
                </p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="font-semibold">Быстрая заявка</p>
                <p className="mt-1 text-sm text-slate-300">
                  После расчёта клиент сразу отправляет готовую заявку.
                </p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="font-semibold">Понятные условия</p>
                <p className="mt-1 text-sm text-slate-300">
                  Срок, взнос и платёж видны сразу, без путаницы.
                </p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="font-semibold">Для разных товаров</p>
                <p className="mt-1 text-sm text-slate-300">
                  Телефоны, техника, стройматериалы и другие покупки.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button
                className="h-12 text-base bg-white text-slate-950 hover:bg-white/90"
                onClick={scrollToCalc}
              >
                Рассчитать сейчас
              </Button>

              <a
                href="https://wa.me/79289999810"
                target="_blank"
                rel="noreferrer"
                className="block"
              >
                <Button
                  variant="outline"
                  className="h-12 w-full text-base border-white text-white bg-transparent hover:bg-white/10"
                >
                  Написать в WhatsApp
                </Button>
              </a>
            </div>
          </div>

          <Card className="rounded-3xl p-6 shadow-sm border-0 bg-white">
            <p className="text-sm font-medium text-slate-500">Примеры товаров</p>

            <div className="mt-4 grid gap-3">
              {[
                "iPhone и смартфоны",
                "Телевизоры и техника",
                "Холодильники и бытовая техника",
                "Стройматериалы",
                "Инструменты и оборудование",
                "Другие нужные товары",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl bg-slate-50 p-4">
              <p className="font-semibold">Почему это удобно клиенту</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>• Сразу виден примерный платёж в месяц</li>
                <li>• Можно выбрать вариант со взносом и без</li>
                <li>• Заявка уходит сразу в WhatsApp</li>
                <li>• Не нужно долго объяснять менеджеру, что нужно</li>
              </ul>
            </div>

            <div className="mt-6 rounded-2xl bg-emerald-50 p-4">
              <p className="font-semibold text-emerald-800">
                Предварительный пример
              </p>
              <p className="mt-2 text-sm text-emerald-900">
                Если товар стоит <span className="font-semibold">100 000 ₽</span>,
                срок <span className="font-semibold">6 месяцев</span> и без
                взноса, то ежемесячный платёж будет около{" "}
                <span className="font-semibold">21 000 ₽</span>.
              </p>
            </div>
          </Card>
        </div>

        <div id="calculator" className="mt-6">
          <Card className="rounded-3xl p-6 md:p-8 shadow-sm border-0 bg-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <Badge>Калькулятор</Badge>
                <h2 className="mt-3 text-2xl md:text-3xl font-bold">
                  Рассчитать рассрочку
                </h2>
                <p className="mt-2 text-sm md:text-base text-slate-500">
                  Заполните поля ниже и сразу получите предварительный расчёт.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-100 px-4 py-3">
                <p className="text-xs text-slate-500">Ежемесячный платёж</p>
                <p className="text-2xl font-bold">{formatMoney(monthly)}</p>
              </div>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <div className="space-y-5">
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

                <div className="space-y-3">
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
                      Минимальный взнос: {minDownPercent}% (
                      {formatMoney(minDownAmount)})
                    </p>
                    {!isDownPaymentValid && (
                      <p className="text-sm text-red-500">
                        Взнос слишком маленький. Минимум:{" "}
                        {formatMoney(minDownAmount)}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-5">
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p>Наценка: {rate}%</p>
                  <p className="mt-2">Итоговая сумма: {formatMoney(total)}</p>
                  <p className="mt-2">
                    К финансированию: {formatMoney(financed)}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    {noDown
                      ? "Без первоначального взноса"
                      : `Со взносом ${formatMoney(safeDownPayment)}`}
                  </p>
                  <p className="mt-4 text-sm text-slate-500">
                    Ежемесячный платёж
                  </p>
                  <p className="text-4xl font-bold">{formatMoney(monthly)}</p>
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
                  className={
                    canSend ? "block" : "block pointer-events-none opacity-50"
                  }
                >
                  <Button className="w-full h-12 text-base">
                    Оформить через WhatsApp
                  </Button>
                </a>

                <p className="text-xs text-slate-500">
                  Предварительный расчёт не является окончательным одобрением
                  заявки.
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-6 rounded-3xl bg-slate-950 px-6 py-8 text-white text-center">
          <h3 className="text-2xl font-bold">
            Готовы узнать платёж и отправить заявку?
          </h3>
          <p className="mt-3 text-slate-300 max-w-2xl mx-auto">
            Рассчитайте сумму прямо сейчас и отправьте готовую заявку в WhatsApp
            за пару нажатий.
          </p>
          <div className="mt-5 flex flex-col sm:flex-row justify-center gap-3">
            <Button
              className="h-12 text-base bg-white text-slate-950 hover:bg-white/90"
              onClick={scrollToCalc}
            >
              Перейти к калькулятору
            </Button>

            <a
              href="https://wa.me/79289999810"
              target="_blank"
              rel="noreferrer"
              className="block"
            >
              <Button
                variant="outline"
                className="h-12 w-full text-base border-white text-white bg-transparent hover:bg-white/10"
              >
                Написать в WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}