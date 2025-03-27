import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServidorItemComponent } from './servidor-item.component';

describe('ServidorItemComponent', () => {
  let component: ServidorItemComponent;
  let fixture: ComponentFixture<ServidorItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServidorItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServidorItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
