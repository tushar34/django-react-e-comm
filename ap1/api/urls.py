from django.urls import path
from .views import *

urlpatterns = [

    path('products/', ItemListView.as_view(), name='products'),
    path('add-to-cart/', AddToCartView.as_view(), name='add-to-cart'),
    path('order-summary/', OrderDetailView.as_view(), name='order-summary'),
    path('checkout/', Paymentview.as_view(), name="checkout"),
    path('add-coupon/', AddCoupon.as_view(), name="add-coupon"),
    path('addresses/', AddressListView.as_view(), name="addresses"),
    path('addresses/create/', AddressCreatetView.as_view(), name="addresses-create"),
    path('countries/', CountryListview.as_view(), name="countries-list"),
    path('user-id/', UserIDView.as_view(), name="user-id"),
    path('addresses/<pk>/update/',
         AddressUpdateView.as_view(), name="update-address"),
    path('order-items/<pk>/delete/',
         OrderItemDeleteView.as_view(), name="delete-orderitem"),
    path('order-item/update-quantity/',
         OrderQuantityUpdateView.as_view(), name='order-item-update-quantity'),

]
