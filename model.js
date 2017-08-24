const Sequelize = require('sequelize')
const conn = new Sequelize('postgres://localhost/practice')
const Promise = require('bluebird')

const Product = conn.define('product', {
  random: {
    type: Sequelize.STRING,
    set: function(val) {
      // does not matter to have return or not
      this.setDataValue('random', `${val}999`)
    }
  },
  description: {
    type: Sequelize.TEXT,
    get: function() {
      return `${this.getDataValue('description')}!!`
    }
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      len: [2, 10],
      isCapitalized(value) {
        if (value[0] !== value[0].toUpperCase()) {
          throw new Error('The first letter should be upper case!')
        }
      }
    },
    defaultValue: 'Default'
  }
}, {
  getterMethods: {
    upperCaseName: function() {
      return this.name.toUpperCase()
    }
  },
  hooks: {
    beforeValidate: function(instance) {
      console.log('---------')
      instance.random = Math.random()
    }
  }
})

const Category = conn.define('category', {
  name: {
    type: Sequelize.STRING
  }
})

// helper funcitons setCategory and getCategory created
Product.belongsTo(Category)

// helper functions addProduct
Category.hasMany(Product)

Product.prototype.howLongIsYourName = function() {
  return this.name.length
}

Product.sayHi = function() {
  return 'Hi'
}

Product.findFoos = function() {
  return this.findAll({
    where: {
      name: 'Foo'
    }
  })
}

conn.sync({force: true, logging: false})
.then( result => {
  console.log('done')
})
.then(result => {
  const p = Product.build();
  console.log(p.setCategory)
})
.then(result => {
  const c = Category.build()
  console.log(c.addProduct)
  console.log(c.countProducts)
  console.log(c.getProducts)
  console.log(c.hasProduct)
})
.then(result => {
  return Promise.all([
    Category.create({}),
    Product.create({name: 'Foo', description: 'This is a foo'}),
    Product.create({name: 'Bar'}),
    Product.create({})
  ])
})
.then( ([c1, p1, p2, p3]) => {
  console.log(p1.upperCaseName) // from getterMethods => virtual attribute
  console.log(p1.description) // real attribute
  console.log(p1.get()) //access to the instance
  console.log(p1.howLongIsYourName()) // instance method
  console.log(Product.sayHi()) // class method
  return p1.setCategory(c1)
})
.then(result => {
  return Product.findFoos()
})
.then(result => {
  console.log(result[0].get())
})

module.exports = {
  models: {
    Product,
    Category
  }
}
