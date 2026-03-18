import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryProgressComponent } from './category-progress';

describe('CategoryProgress', () => {
  let component: CategoryProgressComponent;
  let fixture: ComponentFixture<CategoryProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryProgressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
