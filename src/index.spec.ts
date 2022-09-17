type Base = '🧁' | '🍪';

type Topping = '🍫' | '🥜' | '🍬';

type DollarPrice = `$${number}`;

type Cake = {
  base: Base;
  toppings: Topping[];
  name: () => string;
  price: () => number;
};

type Bundle = {
  content: (Cake | Bundle)[];
  name: (isRoot: boolean) => string;
  price: (isRoot: boolean) => number;
};

const BUNDLE_DISCOUNT: 0.9 = 0.9;

const printName = (toPrint: Cake | Bundle): string => toPrint.name(true);

const printPrice = (toPrint: Cake | Bundle): DollarPrice => `$${toPrint.price(true)}`;

const addPrice = (price: number, item: Cake | Bundle): number => parseFloat((item.price(false) + price).toFixed(2));

const Cake = (base: Base, price: number, toppings: Topping[] = []): Cake => ({
  base,
  toppings,
  name: () => (toppings.length ? `${base} with ${toppings.join(' and ')}` : base),
  price: (): number => price
});

const bundlePriceOf = (content: (Cake | Bundle)[]): number => content.reduce(addPrice, 0);

const applyDiscountFor =
  (price: number) =>
  (apply: boolean): number =>
    price * (apply ? BUNDLE_DISCOUNT : 1);

const bundleComposedOf = (content: (Cake | Bundle)[]): string =>
  content.map((item: Cake | Bundle) => item.name(false)).join(', ');

const bundleName = (displayPrefix: boolean, bundleComposition: string): string =>
  `${displayPrefix ? 'Bundle is composed of ' : ''}${bundleComposition}`;

const printNameFor =
  (bundleComposition: string, isEmpty: boolean) =>
  (displayPrefix: boolean): string =>
    isEmpty ? 'Bundle is empty' : bundleName(displayPrefix, bundleComposition);

const Bundle = (content: (Cake | Bundle)[]): Bundle => ({
  content,
  name: printNameFor(bundleComposedOf(content), content.length === 0),
  price: applyDiscountFor(bundlePriceOf(content))
});

const Topping = (cake: Cake, topping: Topping, price: number): Cake =>
  Cake(cake.base, addPrice(price, cake), [...cake.toppings, topping]);

const cupcake = (): Cake => Cake('🧁', 1);

const cookie = (): Cake => Cake('🍪', 2);

const chocolate = (cake: Cake): Cake => Topping(cake, '🍫', 0.1);

const nuts = (cake: Cake): Cake => Topping(cake, '🥜', 0.2);

const sugar = (cake: Cake): Cake => Topping(cake, '🍬', 0.1);

describe('Cupcake', (): void => {
  it('should print name "🧁" for cupcake', (): void => {
    expect(printName(cupcake())).toBe('🧁');
  });

  it('should print name "🍪" for cookie', (): void => {
    expect(printName(cookie())).toBe('🍪');
  });

  it('should print name "🧁 with 🍫" for cupcake with chocolate topping', (): void => {
    expect(printName(chocolate(cupcake()))).toBe('🧁 with 🍫');
  });

  it('should print name "🍪 with 🍫" for cookie with chocolate topping', (): void => {
    expect(printName(chocolate(cookie()))).toBe('🍪 with 🍫');
  });

  it('should print name "🍪 with 🍫 and 🥜" for cookie with chocolate and nuts toppings', (): void => {
    expect(printName(nuts(chocolate(cookie())))).toBe('🍪 with 🍫 and 🥜');
  });

  it('should print name "🍪 with 🥜 and 🍫" for cookie with nuts and chocolate toppings', (): void => {
    expect(printName(chocolate(nuts(cookie())))).toBe('🍪 with 🥜 and 🍫');
  });

  it('should print name "🧁 with 🥜 and 🍬 and 🍫" for cupcake with nuts, sugar and chocolate toppings', (): void => {
    expect(printName(chocolate(sugar(nuts(cupcake()))))).toBe('🧁 with 🥜 and 🍬 and 🍫');
  });

  it('should print price "$1" for cupcake', (): void => {
    expect(printPrice(cupcake())).toBe('$1');
  });

  it('should print price "$2" for cookie', (): void => {
    expect(printPrice(cookie())).toBe('$2');
  });

  it('should print price "$1.1" for cupcake with chocolate', (): void => {
    expect(printPrice(chocolate(cupcake()))).toBe('$1.1');
  });

  it('should print price "$2.1" for cookie with chocolate', (): void => {
    expect(printPrice(chocolate(cookie()))).toBe('$2.1');
  });

  it('should print price "$2.2" for cookie with nuts', (): void => {
    expect(printPrice(nuts(cookie()))).toBe('$2.2');
  });

  it('should print price "$2.1" for cookie with nuts', (): void => {
    expect(printPrice(sugar(cookie()))).toBe('$2.1');
  });

  it('should print price "$2.4" for cookie with nuts, chocolate and sugar', (): void => {
    expect(printPrice(sugar(chocolate(nuts(cookie()))))).toBe('$2.4');
  });

  it('should print name "Bundle is empty" when there is no cupcake in the bundle', (): void => {
    expect(printName(Bundle([]))).toBe('Bundle is empty');
  });

  it('should print price "$0" when there is no cupcake in the bundle', (): void => {
    expect(printPrice(Bundle([]))).toBe('$0');
  });

  it('should print name "Bundle is composed of 🧁" when there is only a cupcake in the bundle', (): void => {
    expect(printName(Bundle([cupcake()]))).toBe('Bundle is composed of 🧁');
  });

  it('should print price "$0.9" when there is only a cupcake in the bundle', (): void => {
    expect(printPrice(Bundle([cupcake()]))).toBe('$0.9');
  });

  it('should print name "Bundle is composed of 🧁, 🍪" when there is a cupcake and a cookie in the bundle', (): void => {
    expect(printName(Bundle([cupcake(), cookie()]))).toBe('Bundle is composed of 🧁, 🍪');
  });

  it('should print price "$2.7" when there is a cupcake and a cookie in the bundle', (): void => {
    expect(printPrice(Bundle([cupcake(), cookie()]))).toBe('$2.7');
  });

  it('should print name "Bundle is composed of 🧁, 🧁, 🍪" when there is two cupcake and a cookie in the bundle', (): void => {
    expect(printName(Bundle([cupcake(), cupcake(), cookie()]))).toBe('Bundle is composed of 🧁, 🧁, 🍪');
  });

  it('should print price "$3.6" when there is two cupcake and a cookie in the bundle', (): void => {
    expect(printPrice(Bundle([cupcake(), cupcake(), cookie()]))).toBe('$3.6');
  });

  it('should print name "Bundle is composed of 🍪, 🍪, 🧁" when there is two cookies and a cupcake in the bundle', (): void => {
    expect(printName(Bundle([cookie(), cookie(), cupcake()]))).toBe('Bundle is composed of 🍪, 🍪, 🧁');
  });

  it('should print price "$4.5" when there is two cookies and a cupcake in the bundle', (): void => {
    expect(printPrice(Bundle([cookie(), cookie(), cupcake()]))).toBe('$4.5');
  });

  it('should print name "Bundle is composed of 🧁, 🧁, 🍪, 🍪, 🧁, 🍪, 🧁, 🧁, 🍪, 🍪, 🍪, 🧁" when there is many bundle of bundle and many cakes', (): void => {
    expect(
      printName(
        Bundle([
          Bundle([cupcake(), cupcake()]),
          Bundle([cookie(), cookie(), cupcake()]),
          Bundle([Bundle([cookie(), cupcake()]), Bundle([cupcake(), cookie()])]),
          cookie(),
          cookie(),
          cupcake()
        ])
      )
    ).toBe('Bundle is composed of 🧁, 🧁, 🍪, 🍪, 🧁, 🍪, 🧁, 🧁, 🍪, 🍪, 🍪, 🧁');
  });

  it('should print price "$16.2" when there is many bundle of bundle and many cakes', (): void => {
    expect(
      printPrice(
        Bundle([
          Bundle([cupcake(), cupcake()]),
          Bundle([cookie(), cookie(), cupcake()]),
          Bundle([Bundle([cookie(), cupcake()]), Bundle([cupcake(), cookie()])]),
          cookie(),
          cookie(),
          cupcake()
        ])
      )
    ).toBe('$16.2');
  });
});
